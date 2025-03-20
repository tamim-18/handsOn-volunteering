"use client";

import { motion } from "framer-motion";
import { Search, Filter, AlertCircle, Clock, MapPin, MessageSquare } from "lucide-react";

const helpRequests = [
  {
    id: 1,
    title: "Need Volunteers for Weekly Tutoring",
    description: "Looking for volunteers to help tutor underprivileged children in math and science. Weekly commitment required.",
    urgency: "Medium",
    location: "Local Library",
    postedAt: "2 days ago",
    responses: 5,
    author: {
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    },
  },
  {
    id: 2,
    title: "Emergency Food Distribution Help",
    description: "Urgent need for volunteers to help distribute food packages to homeless shelters this weekend.",
    urgency: "High",
    location: "Downtown Food Bank",
    postedAt: "1 day ago",
    responses: 8,
    author: {
      name: "Mike Chen",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
    },
  },
  {
    id: 3,
    title: "Senior Home Garden Maintenance",
    description: "Need help maintaining the garden at our senior living facility. Green thumbs welcome!",
    urgency: "Low",
    location: "Sunrise Senior Living",
    postedAt: "3 days ago",
    responses: 3,
    author: {
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
    },
  },
];

const urgencyColors = {
  High: "text-destructive bg-destructive/10",
  Medium: "text-yellow-600 bg-yellow-50",
  Low: "text-green-600 bg-green-50",
};

export default function HelpRequestsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Community Help Requests</h1>
        <p className="text-muted-foreground mt-2">
          Browse and respond to help requests from your community.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search help requests..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            <Filter className="h-5 w-5" />
            Filters
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Post Request
          </button>
        </div>
      </div>

      {/* Help Requests */}
      <div className="grid gap-6">
        {helpRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <img
                src={request.author.image}
                alt={request.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{request.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      urgencyColors[request.urgency as keyof typeof urgencyColors]
                    }`}
                  >
                    {request.urgency}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{request.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{request.postedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{request.responses} responses</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Offer Help
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}