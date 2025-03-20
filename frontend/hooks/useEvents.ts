import { useState, useEffect } from "react";
import { toast } from "sonner";

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

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      setEvents(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to join events");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user._id) {
        toast.error("User session expired. Please login again");
        return;
      }

      // Check if user is already a participant
      const event = events.find((e) => e._id === eventId);
      if (!event) {
        toast.error("Event not found");
        return;
      }

      if (event.participants.some((p) => p._id === user._id)) {
        toast.error("You have already joined this event");
        return;
      }

      if (event.status !== "upcoming") {
        toast.error("This event is no longer accepting participants");
        return;
      }

      toast.loading("Joining event...", { id: "join-event" });

      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join event");
      }

      // Update local state
      setEvents(
        events.map((event) =>
          event._id === eventId
            ? {
                ...event,
                participants: [...event.participants, data.data.user],
              }
            : event
        )
      );

      toast.success("Successfully joined event!", {
        id: "join-event",
        description: "You can now view this event in your joined events.",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to join event", {
        id: "join-event",
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on category and search query
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "All Events" || event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return {
    events: filteredEvents,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    joinEvent,
    categories: [
      "All Events",
      "Environment",
      "Food Security",
      "Education",
      "Healthcare",
      "Elderly Care",
      "Youth Development",
    ],
  };
}
