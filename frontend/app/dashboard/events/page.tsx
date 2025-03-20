"use client";

import { motion } from "framer-motion";
import { Search, Filter, MapPin, Calendar, Users, Clock } from "lucide-react";

const events = [
  {
    id: 1,
    title: "City Park Cleanup",
    description: "Join us in cleaning up the city park and making it beautiful for everyone.",
    date: "March 15, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "Central Park",
    category: "Environment",
    organizer: "Green Earth Initiative",
    participants: 15,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    title: "Food Bank Distribution",
    description: "Help distribute food to families in need at our local community center.",
    date: "March 18, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Community Center",
    category: "Food Security",
    organizer: "Food for All",
    participants: 8,
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    title: "Senior Home Visit",
    description: "Spend time with elderly residents, playing games and sharing stories.",
    date: "March 20, 2024",
    time: "10:00 AM - 1:00 PM",
    location: "Sunrise Senior Living",
    category: "Elderly Care",
    organizer: "Care Connect",
    participants: 5,
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=60",
  },
];

const categories = [
  "All Events",
  "Environment",
  "Food Security",
  "Education",
  "Healthcare",
  "Elderly Care",
  "Youth Development",
];

export default function EventsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Volunteer Events</h1>
        <p className="text-muted-foreground mt-2">
          Find and join meaningful volunteer opportunities in your community.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground whitespace-nowrap hover:bg-secondary/80 transition-colors"
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl overflow-hidden shadow-sm"
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            />
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {event.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {event.description}
              </p>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.participants} volunteers joined</span>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Join Event
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}