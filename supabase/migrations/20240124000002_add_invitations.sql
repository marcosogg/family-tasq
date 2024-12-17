-- Create family_group_invitations table
create table if not exists "public"."family_group_invitations" (
    "id" uuid not null default gen_random_uuid(),
    "family_group_id" uuid not null references "public"."family_groups"("id") on delete cascade,
    "inviter_id" uuid not null references "public"."profiles"("id") on delete cascade,
    "invitee_email" text not null,
    "status" text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key ("id")
);

-- Enable RLS
alter table "public"."family_group_invitations" enable row level security;

-- Create an index for faster lookups
create index if not exists "idx_family_group_invitations_invitee_email" 
    on "public"."family_group_invitations" ("invitee_email");

-- RLS Policies

-- Users can view invitations they've sent or received
create policy "users_can_view_related_invitations" on "public"."family_group_invitations"
    for select using (
        inviter_id = auth.uid() or 
        invitee_email = (
            select email from profiles where id = auth.uid()
        )
    );

-- Users can create invitations for family groups they belong to
create policy "users_can_create_invitations" on "public"."family_group_invitations"
    for insert with check (
        family_group_id in (
            select family_group_id 
            from user_family_groups 
            where user_id = auth.uid()
        )
    );

-- Users can update invitations they've received
create policy "users_can_update_received_invitations" on "public"."family_group_invitations"
    for update using (
        invitee_email = (
            select email from profiles where id = auth.uid()
        )
    );

-- Add updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_family_group_invitations_updated_at
    before update on family_group_invitations
    for each row
    execute function update_updated_at_column();

-- Add comment
comment on table "public"."family_group_invitations" is 'Stores invitations for users to join family groups';
