"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Clock,
  Loader2,
  Plus,
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  creator: {
    _id: string;
    name: string;
    email: string;
  };
  participants: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const EventCard = ({
  event,
  onJoin,
}: {
  event: Event;
  onJoin: (id: string) => Promise<void>;
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isParticipant = event.participants.some((p) => p._id === user._id);
  const isCreator = event.creator._id === user._id;

  const handleJoin = async () => {
    if (isJoining) return;
    setIsJoining(true);
    try {
      await onJoin(event._id);
    } finally {
      setIsJoining(false);
    }
  };

  const getButtonText = () => {
    if (isJoining) return "Joining...";
    if (isParticipant) return "Joined";
    if (isCreator) return "Created by you";
    if (event.status === "completed") return "Completed";
    if (event.status === "cancelled") return "Cancelled";
    return "Join Event";
  };

  const getButtonVariant = () => {
    if (isParticipant) return "secondary";
    if (isCreator) return "outline";
    if (event.status === "completed") return "secondary";
    if (event.status === "cancelled") return "destructive";
    return "default";
  };

  const isButtonDisabled = () => {
    return (
      isJoining || isParticipant || isCreator || event.status !== "upcoming"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
    >
      {event.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/400x200?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="bg-background/50 backdrop-blur-sm"
              >
                {event.category}
              </Badge>
              <Badge
                variant={
                  event.status === "upcoming"
                    ? "default"
                    : event.status === "ongoing"
                    ? "secondary"
                    : event.status === "completed"
                    ? "secondary"
                    : "destructive"
                }
                className="bg-background/50 backdrop-blur-sm"
              >
                {event.status}
              </Badge>
            </div>
          </div>
          <Button
            variant={getButtonVariant()}
            size="sm"
            onClick={handleJoin}
            disabled={isButtonDisabled()}
            className={cn(
              "min-w-[100px] transition-all duration-300",
              isJoining && "animate-pulse"
            )}
          >
            {isJoining ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Joining...
              </div>
            ) : (
              getButtonText()
            )}
          </Button>
        </div>

        <p className="text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors duration-300">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(event.date), "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {event.participants.length} participants
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Created {format(new Date(event.createdAt), "MMM d, yyyy")}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function EventsPage() {
  const router = useRouter();
  const {
    events,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    joinEvent,
    categories,
  } = useEvents();

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <PageLayout
      title="Volunteer Events"
      description="Find and join meaningful volunteer opportunities in your community"
      actions={
        <Button onClick={() => router.push("/dashboard/events/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Search and Filter */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Categories */}
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex gap-2 p-2">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </ScrollArea>

        {/* Events Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Card>
        ) : events.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No events found</p>
          </Card>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard key={event._id} event={event} onJoin={joinEvent} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </PageLayout>
  );
}
