"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/useEvents";
import { toast } from "sonner";
import Link from "next/link";

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

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { joinEvent } = useEvents();
  const [isJoining, setIsJoining] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isParticipant = event.participants.some(
    (p) => p._id === currentUser._id
  );
  const isCreator = event.creator._id === currentUser._id;

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await joinEvent(event._id);
    } catch (error) {
      console.error("Error joining event:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const getButtonText = () => {
    if (isCreator) return "Created by you";
    if (isParticipant) return "Joined";
    if (event.status === "completed") return "Completed";
    if (event.status === "cancelled") return "Cancelled";
    if (event.participants.length >= event.maxParticipants) return "Full";
    return "Join Event";
  };

  const getButtonVariant = () => {
    if (isCreator || isParticipant) return "secondary";
    if (event.status === "completed" || event.status === "cancelled")
      return "ghost";
    if (event.participants.length >= event.maxParticipants)
      return "destructive";
    return "default";
  };

  const isButtonDisabled = () => {
    return (
      isCreator ||
      isParticipant ||
      event.status !== "upcoming" ||
      event.participants.length >= event.maxParticipants ||
      isJoining
    );
  };

  return (
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
                : "destructive"
            }
            className="absolute top-4 right-4"
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      )}

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
          <p className="text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
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

        <div className="flex items-center justify-between pt-4">
          <Button
            variant={getButtonVariant()}
            onClick={handleJoin}
            disabled={isButtonDisabled()}
            className="flex-1"
          >
            {isJoining ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Joining...
              </div>
            ) : (
              getButtonText()
            )}
          </Button>
          <Link href={`/dashboard/events/${event._id}`}>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
