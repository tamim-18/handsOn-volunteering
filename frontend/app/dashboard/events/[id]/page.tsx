"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  Phone,
  Globe,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
  requirements: string[];
  contactInfo: string;
  isRecurring: boolean;
  recurringDetails?: {
    frequency: string;
    endDate: string;
  };
}

export default function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    fetchEventDetails();
  }, [params.id]);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view event details");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/events/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch event details");
      }

      setEvent(data.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch event details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to delete events");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/events/${event._id}`,
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

      toast.success("Event deleted successfully");
      router.push("/dashboard/events/manage");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!event) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to update event status");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/events/${event._id}`,
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

      setEvent({ ...event, status: newStatus });
      toast.success("Event status updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update event status"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isCreator = event.creator._id === currentUser._id;
  const isParticipant = event.participants.some(
    (p) => p._id === currentUser._id
  );

  return (
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
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-muted-foreground mt-1">
            Created by {event.creator.name}
          </p>
        </div>
      </div>

      {/* Event Image */}
      {event.image && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[400px] rounded-lg overflow-hidden"
        >
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
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="bg-card rounded-lg p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">About This Event</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                      <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-5 w-5" />
                      <span>
                        {event.participants.length}/{event.maxParticipants}{" "}
                        participants
                      </span>
                    </div>
                  </div>
                </div>

                {event.requirements && event.requirements.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Requirements</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {event.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {event.isRecurring && event.recurringDetails && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Recurring Details
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="h-5 w-5" />
                        <span>
                          Repeats {event.recurringDetails.frequency} until{" "}
                          {format(
                            new Date(event.recurringDetails.endDate),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="participants">
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Participants</h2>
                  <Badge variant="secondary">
                    {event.participants.length}/{event.maxParticipants}
                  </Badge>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {event.participants.map((participant) => (
                      <div
                        key={participant._id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {participant.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Actions & Contact */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{event.creator.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{event.contactInfo}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Event Actions</h2>
              {isCreator ? (
                <div className="space-y-2">
                  {event.status === "upcoming" && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusChange("ongoing")}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Start Event
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusChange("cancelled")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Event
                      </Button>
                    </>
                  )}
                  {event.status === "ongoing" && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleStatusChange("completed")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      router.push(`/dashboard/events/${event._id}/edit`)
                    }
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                  <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Event</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this event? This
                          action cannot be undone.
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
              ) : (
                <div className="space-y-2">
                  {event.status === "upcoming" && !isParticipant && (
                    <Button className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Join Event
                    </Button>
                  )}
                  {isParticipant && (
                    <Button variant="secondary" className="w-full">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Joined
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
