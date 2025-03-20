"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  maxParticipants: number;
  participants: {
    _id: string;
    name: string;
    email: string;
  }[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  creator: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function ManageEventsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("created");
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view your events");
        return;
      }

      const response = await fetch("http://localhost:5000/api/events/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      setCreatedEvents(data.data.createdEvents);
      setJoinedEvents(data.data.joinedEvents);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch events"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to delete events");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/events/${eventToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      setCreatedEvents((prev) =>
        prev.filter((event) => event._id !== eventToDelete._id)
      );
      setJoinedEvents((prev) =>
        prev.filter((event) => event._id !== eventToDelete._id)
      );
      toast.success("Event deleted successfully");
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to update event status");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update event status");
      }

      // Update local state
      setCreatedEvents((prev) =>
        prev.map((event) =>
          event._id === eventId ? { ...event, status: newStatus } : event
        )
      );
      setJoinedEvents((prev) =>
        prev.map((event) =>
          event._id === eventId ? { ...event, status: newStatus } : event
        )
      );

      toast.success("Event status updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update event status"
      );
    }
  };

  const EventCard = ({
    event,
    isCreator = false,
  }: {
    event: Event;
    isCreator?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg overflow-hidden border"
    >
      {event.image && (
        <div className="relative h-48">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <Badge
            variant={
              event.status === "upcoming"
                ? "default"
                : event.status === "ongoing"
                ? "secondary"
                : event.status === "completed"
                ? "success"
                : "destructive"
            }
            className="absolute top-4 right-4"
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>
          {isCreator && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  router.push(`/dashboard/events/${event._id}/edit`)
                }
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEventToDelete(event)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Event</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this event? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteEvent}
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
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {event.participants.length}/{event.maxParticipants} participants
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{event.category}</Badge>
        </div>

        {isCreator && event.status === "upcoming" && (
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleStatusChange(event._id, "ongoing")}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Start Event
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleStatusChange(event._id, "cancelled")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Event
            </Button>
          </div>
        )}

        {isCreator && event.status === "ongoing" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleStatusChange(event._id, "completed")}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Completed
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push(`/dashboard/events/${event._id}`)}
        >
          View Details
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Manage Events</h1>
          <p className="text-muted-foreground mt-2">
            Manage your created events and track your participation
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/events/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="created">Created Events</TabsTrigger>
          <TabsTrigger value="joined">Joined Events</TabsTrigger>
        </TabsList>

        <TabsContent value="created">
          <AnimatePresence mode="wait">
            {createdEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">No events created yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => router.push("/dashboard/events/create")}
                >
                  Create Your First Event
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {createdEvents.map((event) => (
                  <EventCard key={event._id} event={event} isCreator />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="joined">
          <AnimatePresence mode="wait">
            {joinedEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">No events joined yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => router.push("/dashboard/events/discover")}
                >
                  Discover Events
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {joinedEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
