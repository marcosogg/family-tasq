-- Enable RLS on the tasks table
alter table "public"."tasks" enable row level security;

-- Policy for selecting tasks:
-- Users can see tasks that either:
-- 1. Belong to their family groups (via user_family_groups)
-- 2. Are their personal tasks (family_group_id is null and user_id matches)
create policy "users_can_view_family_and_personal_tasks" on "public"."tasks"
  for select using (
    (family_group_id is null and user_id = auth.uid()) or
    exists (
      select 1 
      from user_family_groups ufg
      where ufg.family_group_id = tasks.family_group_id
      and ufg.user_id = auth.uid()
    )
  );

-- Policy for inserting tasks:
-- Users can only create tasks for their family groups or as personal tasks
create policy "users_can_insert_family_and_personal_tasks" on "public"."tasks"
  for insert with check (
    (family_group_id is null and user_id = auth.uid()) or
    exists (
      select 1 
      from user_family_groups ufg
      where ufg.family_group_id = family_group_id
      and ufg.user_id = auth.uid()
    )
  );

-- Policy for updating tasks:
-- Users can only update tasks from their family groups or their personal tasks
create policy "users_can_update_family_and_personal_tasks" on "public"."tasks"
  for update using (
    (family_group_id is null and user_id = auth.uid()) or
    exists (
      select 1 
      from user_family_groups ufg
      where ufg.family_group_id = tasks.family_group_id
      and ufg.user_id = auth.uid()
    )
  );

-- Policy for deleting tasks:
-- Users can only delete tasks from their family groups or their personal tasks
create policy "users_can_delete_family_and_personal_tasks" on "public"."tasks"
  for delete using (
    (family_group_id is null and user_id = auth.uid()) or
    exists (
      select 1 
      from user_family_groups ufg
      where ufg.family_group_id = tasks.family_group_id
      and ufg.user_id = auth.uid()
    )
  );

-- Enable RLS on the family_groups table
alter table "public"."family_groups" enable row level security;

-- Policy for viewing family groups:
-- Users can see family groups they are members of
create policy "users_can_view_their_family_groups" on "public"."family_groups"
  for select using (
    exists (
      select 1 
      from user_family_groups ufg
      where ufg.family_group_id = family_groups.id
      and ufg.user_id = auth.uid()
    )
  );

-- Policy for creating family groups:
-- Any authenticated user can create a family group
create policy "users_can_create_family_groups" on "public"."family_groups"
  for insert with check (true);

-- Enable RLS on the user_family_groups table
alter table "public"."user_family_groups" enable row level security;

-- Policy for viewing user_family_groups:
-- Users can see all members of family groups they belong to
create policy "users_can_view_family_group_members" on "public"."user_family_groups"
  for select using (
    exists (
      select 1 
      from user_family_groups ufg
      where ufg.family_group_id = user_family_groups.family_group_id
      and ufg.user_id = auth.uid()
    )
  );

-- Policy for joining family groups:
-- Users can add themselves to family groups
create policy "users_can_join_family_groups" on "public"."user_family_groups"
  for insert with check (
    user_id = auth.uid()
  );

-- Policy for leaving family groups:
-- Users can remove themselves from family groups
create policy "users_can_leave_family_groups" on "public"."user_family_groups"
  for delete using (
    user_id = auth.uid()
  );
