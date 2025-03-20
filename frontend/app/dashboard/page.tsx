"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  Clock,
  Heart,
  Users,
  Award,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

// Dummy data for demonstration
const stats = [
  {
    label: "Volunteer Hours",
    value: "124",
    change: "+12%",
    trend: "up",
    icon: Clock,
  },
  {
    label: "Events Joined",
    value: "38",
    change: "+5%",
    trend: "up",
    icon: Calendar,
  },
  {
    label: "Impact Points",
    value: "2,450",
    change: "+18%",
    trend: "up",
    icon: Activity,
  },
  {
    label: "People Helped",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: Heart,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "City Park Cleanup",
    date: "Tomorrow, 9:00 AM",
    location: "Central Park",
    participants: 12,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
  },
  {
    id: 2,
    title: "Food Bank Distribution",
    date: "Saturday, 10:00 AM",
    location: "Community Center",
    participants: 8,
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "event_joined",
    user: {
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    event: "Beach Cleanup Drive",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "achievement",
    user: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
    achievement: "100 Hours Milestone",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "team_created",
    user: {
      name: "Emma Thompson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
    team: "Green Warriors",
    time: "1 day ago",
  },
];

const achievements = [
  {
    name: "First Step",
    description: "Complete your first volunteer event",
    progress: 100,
    icon: "🌟",
  },
  {
    name: "Team Player",
    description: "Join or create a volunteer team",
    progress: 100,
    icon: "👥",
  },
  {
    name: "Impact Maker",
    description: "Reach 50 volunteer hours",
    progress: 75,
    icon: "🎯",
  },
  {
    name: "Community Leader",
    description: "Create and lead 5 events",
    progress: 40,
    icon: "👑",
  },
];

export default function DashboardPage() {
  return (
    <PageLayout
      title="Welcome back!"
      description="Track your volunteer journey and make a difference"
    >
      <div className="grid gap-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <span
                        className={`text-sm flex items-center ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Events & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <Button variant="ghost" className="gap-2">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-6">
                {upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div
                      className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.participants} joined
                        </div>
                      </div>
                    </div>
                    <Button>Join</Button>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Button variant="ghost" className="gap-2">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4"
                    >
                      <Avatar>
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>
                          {activity.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            {activity.user.name}
                          </span>{" "}
                          {activity.type === "event_joined" && (
                            <>
                              joined the event{" "}
                              <span className="font-medium">
                                {activity.event}
                              </span>
                            </>
                          )}
                          {activity.type === "achievement" && (
                            <>
                              earned the{" "}
                              <span className="font-medium">
                                {activity.achievement}
                              </span>{" "}
                              achievement
                            </>
                          )}
                          {activity.type === "team_created" && (
                            <>
                              created a new team{" "}
                              <span className="font-medium">
                                {activity.team}
                              </span>
                            </>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Right Column - Achievements & Quick Actions */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid gap-4">
                <Button className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Join Team
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Help Request
                </Button>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Achievements</h2>
                <Badge variant="secondary">4/12</Badge>
              </div>
              <div className="space-y-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{achievement.name}</p>
                          <span className="text-sm text-muted-foreground">
                            {achievement.progress}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    <Progress value={achievement.progress} />
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
