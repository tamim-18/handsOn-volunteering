"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Trophy, 
  Star, 
  Calendar,
  MapPin,
  MessageSquare,
  Settings,
  UserPlus,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

// Dummy data for team details
const teamData = {
  id: 1,
  name: "Green Warriors",
  description: "Dedicated to environmental conservation and sustainability initiatives. We organize regular clean-up drives, tree plantation events, and awareness campaigns.",
  category: "Environment",
  members: 12,
  impactPoints: 450,
  achievements: 8,
  image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
  isPrivate: false,
  upcomingEvents: 3,
  leader: {
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    role: "Team Leader",
  },
  events: [
    {
      id: 1,
      title: "City Park Cleanup",
      date: "March 15, 2024",
      time: "9:00 AM",
      location: "Central Park",
      participants: 8,
    },
    {
      id: 2,
      title: "Tree Planting Drive",
      date: "March 20, 2024",
      time: "10:00 AM",
      location: "Riverside Park",
      participants: 12,
    },
  ],
  members: [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
      role: "Team Leader",
      impactPoints: 120,
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
      role: "Member",
      impactPoints: 85,
    },
    {
      id: 3,
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
      role: "Member",
      impactPoints: 95,
    },
  ],
  achievements: [
    {
      id: 1,
      title: "100 Trees Planted",
      description: "Successfully planted 100 trees in the community",
      date: "February 2024",
      icon: "🌳",
    },
    {
      id: 2,
      title: "1000kg Waste Collected",
      description: "Collected and properly disposed of 1000kg of waste",
      date: "January 2024",
      icon: "♻️",
    },
  ],
};

export default function TeamDetailsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/teams"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Teams
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${teamData.image})` }}
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{teamData.name}</h1>
                {teamData.isPrivate && (
                  <span className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                    Private
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {teamData.description}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              <UserPlus className="h-5 w-5" />
              Join Team
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Users, label: "Members", value: teamData.members },
              { icon: Trophy, label: "Impact Points", value: teamData.impactPoints },
              { icon: Star, label: "Achievements", value: teamData.achievements.length },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="grid gap-4">
              {teamData.events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{event.participants} joined</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                      Join Event
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Achievements */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Achievements</h2>
            <div className="grid gap-4">
              {teamData.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold">{achievement.title}</h3>
                      <p className="text-muted-foreground">{achievement.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Achieved in {achievement.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Leader */}
          <div className="bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Team Leader</h3>
            <div className="flex items-center gap-3">
              <img
                src={teamData.leader.image}
                alt={teamData.leader.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium">{teamData.leader.name}</p>
                <p className="text-sm text-muted-foreground">{teamData.leader.role}</p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Team Members</h3>
            <div className="space-y-4">
              {teamData.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <Trophy className="h-4 w-4" />
                    <span>{member.impactPoints}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              View All Members
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Team Chat
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}