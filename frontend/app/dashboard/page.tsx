"use client";

import { motion } from "framer-motion";
import { Calendar, Users, Award, Clock } from "lucide-react";

const stats = [
  { name: "Volunteer Hours", value: "24", icon: Clock },
  { name: "Events Joined", value: "12", icon: Calendar },
  { name: "Team Members", value: "8", icon: Users },
  { name: "Impact Points", value: "120", icon: Award },
];

const upcomingEvents = [
  {
    id: 1,
    title: "City Park Cleanup",
    date: "March 15, 2024",
    time: "9:00 AM",
    location: "Central Park",
    participants: 15,
  },
  {
    id: 2,
    title: "Food Bank Distribution",
    date: "March 18, 2024",
    time: "2:00 PM",
    location: "Community Center",
    participants: 8,
  },
  {
    id: 3,
    title: "Senior Home Visit",
    date: "March 20, 2024",
    time: "10:00 AM",
    location: "Sunrise Senior Living",
    participants: 5,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-muted-foreground mt-2">
          Track your volunteering journey and make a difference.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <div className="grid gap-6">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-muted-foreground">
                    {event.date} at {event.time}
                  </p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.participants} joined</span>
                  </div>
                  <button className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}