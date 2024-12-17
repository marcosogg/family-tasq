import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';

type FamilyGroup = Database['public']['Tables']['family_groups']['Row'];
type UserFamilyGroup = Database['public']['Tables']['user_family_groups']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

// Extended type to include joined data
type FamilyGroupInvitation = Database['public']['Tables']['family_group_invitations']['Row'] & {
  family_groups?: {
    name: string;
  };
  profiles?: {
    full_name: string | null;
    email: string;
  };
};

export function useFamilyGroups() {
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [currentFamilyGroup, setCurrentFamilyGroup] = useState<FamilyGroup | null>(null);
  const [receivedInvitations, setReceivedInvitations] = useState<FamilyGroupInvitation[]>([]);
  const [sentInvitations, setSentInvitations] = useState<FamilyGroupInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's family groups
  const fetchUserFamilyGroups = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFamilyGroups([]);
        setCurrentFamilyGroup(null);
        return;
      }

      const { data: userFamilyGroups, error: userFamilyGroupsError } = await supabase
        .from('user_family_groups')
        .select('family_group_id')
        .eq('user_id', user.id);

      if (userFamilyGroupsError) throw userFamilyGroupsError;

      if (userFamilyGroups.length > 0) {
        const familyGroupIds = userFamilyGroups.map(ufg => ufg.family_group_id);
        const { data: groups, error: groupsError } = await supabase
          .from('family_groups')
          .select('*')
          .in('id', familyGroupIds);

        if (groupsError) throw groupsError;

        setFamilyGroups(groups);
        // Set the first family group as current if none is selected
        if (!currentFamilyGroup && groups.length > 0) {
          setCurrentFamilyGroup(groups[0]);
        }
      } else {
        setFamilyGroups([]);
        setCurrentFamilyGroup(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentFamilyGroup]);

  // Fetch invitations
  const fetchInvitations = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch received invitations
      const { data: received, error: receivedError } = await supabase
        .from('family_group_invitations')
        .select(`
          *,
          family_groups (
            name
          ),
          profiles (
            full_name,
            email
          )
        `)
        .eq('invitee_email', user.email)
        .eq('status', 'pending');

      if (receivedError) throw receivedError;
      setReceivedInvitations(received || []);

      // Fetch sent invitations
      const { data: sent, error: sentError } = await supabase
        .from('family_group_invitations')
        .select(`
          *,
          family_groups (
            name
          )
        `)
        .eq('inviter_id', user.id)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;
      setSentInvitations(sent || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, []);

  // Create a new family group
  const createFamilyGroup = async (name: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the family group
      const { data: familyGroup, error: createError } = await supabase
        .from('family_groups')
        .insert({ name })
        .select()
        .single();

      if (createError) throw createError;

      // Add the creator to the family group
      const { error: joinError } = await supabase
        .from('user_family_groups')
        .insert({
          user_id: user.id,
          family_group_id: familyGroup.id
        });

      if (joinError) throw joinError;

      // Refresh the list of family groups
      await fetchUserFamilyGroups();
      return familyGroup;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  // Send an invitation to join a family group
  const sendInvitation = async (familyGroupId: string, inviteeEmail: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('family_group_invitations')
        .insert({
          family_group_id: familyGroupId,
          inviter_id: user.id,
          invitee_email: inviteeEmail,
          status: 'pending'
        });

      if (error) throw error;
      await fetchInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  // Accept an invitation
  const acceptInvitation = async (invitationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the invitation details
      const { data: invitation, error: invitationError } = await supabase
        .from('family_group_invitations')
        .select('family_group_id')
        .eq('id', invitationId)
        .single();

      if (invitationError) throw invitationError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from('family_group_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      // Add user to the family group
      const { error: joinError } = await supabase
        .from('user_family_groups')
        .insert({
          user_id: user.id,
          family_group_id: invitation.family_group_id
        });

      if (joinError) throw joinError;

      await Promise.all([
        fetchUserFamilyGroups(),
        fetchInvitations()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  // Reject an invitation
  const rejectInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('family_group_invitations')
        .update({ status: 'rejected' })
        .eq('id', invitationId);

      if (error) throw error;
      await fetchInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  // Join a family group
  const joinFamilyGroup = async (familyGroupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_family_groups')
        .insert({
          user_id: user.id,
          family_group_id: familyGroupId
        });

      if (error) throw error;

      await fetchUserFamilyGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  // Leave a family group
  const leaveFamilyGroup = async (familyGroupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_family_groups')
        .delete()
        .eq('user_id', user.id)
        .eq('family_group_id', familyGroupId);

      if (error) throw error;

      if (currentFamilyGroup?.id === familyGroupId) {
        setCurrentFamilyGroup(null);
      }

      await fetchUserFamilyGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  // Switch current family group
  const switchFamilyGroup = (familyGroup: FamilyGroup) => {
    setCurrentFamilyGroup(familyGroup);
  };

  // Load family groups and invitations on mount and when user changes
  useEffect(() => {
    fetchUserFamilyGroups();
    fetchInvitations();
  }, [fetchUserFamilyGroups, fetchInvitations]);

  return {
    familyGroups,
    currentFamilyGroup,
    receivedInvitations,
    sentInvitations,
    loading,
    error,
    createFamilyGroup,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    joinFamilyGroup,
    leaveFamilyGroup,
    switchFamilyGroup,
    refreshFamilyGroups: fetchUserFamilyGroups,
    refreshInvitations: fetchInvitations
  };
}
