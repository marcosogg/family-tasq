import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Users, Plus, LogOut, Mail, Check, X } from "lucide-react";
import { useFamilyGroups } from "../hooks/useFamilyGroups";
import { useToast } from "./ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function FamilyGroupManager() {
  const [newGroupName, setNewGroupName] = useState("");
  const [groupIdToJoin, setGroupIdToJoin] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const { 
    familyGroups, 
    currentFamilyGroup,
    receivedInvitations,
    sentInvitations,
    createFamilyGroup, 
    joinFamilyGroup, 
    leaveFamilyGroup,
    sendInvitation,
    acceptInvitation,
    rejectInvitation
  } = useFamilyGroups();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    try {
      await createFamilyGroup(newGroupName);
      setNewGroupName("");
      toast({
        title: "Success",
        description: "Family group created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create family group",
        variant: "destructive",
      });
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupIdToJoin.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group ID",
        variant: "destructive",
      });
      return;
    }

    try {
      await joinFamilyGroup(groupIdToJoin);
      setGroupIdToJoin("");
      toast({
        title: "Success",
        description: "Joined family group successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join family group. Please check the group ID.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      await leaveFamilyGroup(groupId);
      toast({
        title: "Success",
        description: "Left family group successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave family group",
        variant: "destructive",
      });
    }
  };

  const handleSendInvite = async (e: React.FormEvent, groupId: string) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendInvitation(groupId, inviteEmail);
      setInviteEmail("");
      toast({
        title: "Success",
        description: "Invitation sent successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  const handleAcceptInvite = async (invitationId: string) => {
    try {
      await acceptInvitation(invitationId);
      toast({
        title: "Success",
        description: "Invitation accepted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept invitation",
        variant: "destructive",
      });
    }
  };

  const handleRejectInvite = async (invitationId: string) => {
    try {
      await rejectInvitation(invitationId);
      toast({
        title: "Success",
        description: "Invitation rejected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject invitation",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          Manage Family Groups
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Family Groups</DialogTitle>
          <DialogDescription>
            Create, join, or manage your family groups and invitations.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="received">Received Invites</TabsTrigger>
            <TabsTrigger value="sent">Sent Invites</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6 py-4">
            {/* Create New Group */}
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newGroup">Create New Group</Label>
                <div className="flex gap-2">
                  <Input
                    id="newGroup"
                    placeholder="Enter group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                  <Button type="submit" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>

            {/* Join Existing Group */}
            <form onSubmit={handleJoinGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joinGroup">Join Existing Group</Label>
                <div className="flex gap-2">
                  <Input
                    id="joinGroup"
                    placeholder="Enter group ID"
                    value={groupIdToJoin}
                    onChange={(e) => setGroupIdToJoin(e.target.value)}
                  />
                  <Button type="submit" size="sm">
                    Join
                  </Button>
                </div>
              </div>
            </form>

            {/* List of Current Groups */}
            <div className="space-y-4">
              <Label>Your Groups</Label>
              <div className="space-y-4">
                {familyGroups.map((group) => (
                  <div
                    key={group.id}
                    className="space-y-3 p-4 rounded-lg border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-gray-500">ID: {group.id}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLeaveGroup(group.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Invite Form */}
                    <form onSubmit={(e) => handleSendInvite(e, group.id)} className="flex gap-2">
                      <Input
                        placeholder="Enter email to invite"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        type="email"
                      />
                      <Button type="submit" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                ))}
                {familyGroups.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    You haven't joined any family groups yet
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="received" className="space-y-4 py-4">
            <Label>Received Invitations</Label>
            <div className="space-y-3">
              {receivedInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {invitation.family_groups?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      From: {invitation.profiles?.full_name || invitation.profiles?.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcceptInvite(invitation.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectInvite(invitation.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {receivedInvitations.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No pending invitations
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="space-y-4 py-4">
            <Label>Sent Invitations</Label>
            <div className="space-y-3">
              {sentInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {invitation.family_groups?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      To: {invitation.invitee_email}
                    </p>
                    <p className="text-xs text-gray-400">
                      Status: {invitation.status}
                    </p>
                  </div>
                </div>
              ))}
              {sentInvitations.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No invitations sent
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
