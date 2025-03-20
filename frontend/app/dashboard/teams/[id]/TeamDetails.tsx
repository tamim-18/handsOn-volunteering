"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Trophy,
  Star,
  ChevronLeft,
  Calendar,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Team {
  _id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  members: Array<{
    _id: string;
    name: string;
    email: string;
    role: "admin" | "member";
  }>;
  isPrivate: boolean;
  impactPoints: number;
  achievements: number;
  upcomingEvents: number;
  tags: string[];
  creator: {
    _id: string;
    name: string;
    email: string;
  };
}

interface TeamDetailsProps {
  id: string;
}

export function TeamDetails({ id }: TeamDetailsProps) {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view team details");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch team details");
      }

      setTeam(data.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch team details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!team) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to delete team");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/teams/${team._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete team");
      }

      toast.success("Team deleted successfully");
      router.push("/dashboard/teams");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete team"
      );
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Team not found</p>
      </div>
    );
  }

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isCreator = team.creator._id === currentUser._id;
  const isAdmin = team.members.some(
    (m) => m._id === currentUser._id && m.role === "admin"
  );
  const isMember = team.members.some((m) => m._id === currentUser._id);

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground mt-1">
              Created by {team.creator.name}
            </p>
          </div>
        </div>

        {/* Team Image */}
        {team.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[300px] rounded-lg overflow-hidden"
          >
            <img
              src={team.image}
              alt={team.name}
              className="w-full h-full object-cover"
            />
            {team.isPrivate && (
              <Badge
                variant="secondary"
                className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm"
              >
                Private Team
              </Badge>
            )}
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">About</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {team.description}
                  </p>

                  {team.tags && team.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {team.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="members">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Team Members</h2>
                    <Badge variant="secondary">
                      {team.members.length} members
                    </Badge>
                  </div>

                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {team.members.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                        >
                          <Avatar>
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{member.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {member.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>

              <TabsContent value="events">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">
                    Upcoming Events
                  </h2>
                  {team.upcomingEvents === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No upcoming events
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {/* Event list would go here */}
                      <p className="text-muted-foreground text-center py-8">
                        Events coming soon...
                      </p>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Team Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{team.impactPoints}</p>
                    <p className="text-sm text-muted-foreground">
                      Impact Points
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{team.achievements}</p>
                    <p className="text-sm text-muted-foreground">
                      Achievements
                    </p>
                  </div>
                </div>
              </div>

              {(isCreator || isAdmin) && (
                <>
                  <div className="h-px bg-border" />
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Team Actions</h2>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          router.push(`/dashboard/teams/${team._id}/edit`)
                        }
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Team
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Team
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {!isMember && (
                <>
                  <div className="h-px bg-border" />
                  <Button className="w-full">Join Team</Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
