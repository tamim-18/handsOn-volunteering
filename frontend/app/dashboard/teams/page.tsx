"use client";

import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Users,
  Trophy,
  Star,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const teams = [
  {
    id: 1,
    name: "Green Warriors",
    description:
      "Dedicated to environmental conservation and sustainability initiatives.",
    category: "Environment",
    members: 12,
    impactPoints: 450,
    achievements: 8,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    isPrivate: false,
    upcomingEvents: 3,
  },
  {
    id: 2,
    name: "Food for All",
    description:
      "Fighting hunger through food drives and community outreach programs.",
    category: "Food Security",
    members: 8,
    impactPoints: 320,
    achievements: 5,
    image:
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&auto=format&fit=crop&q=60",
    isPrivate: false,
    upcomingEvents: 2,
  },
  {
    id: 3,
    name: "Tech Mentors",
    description:
      "Providing technology education and support to underserved communities.",
    category: "Education",
    members: 15,
    impactPoints: 280,
    achievements: 4,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
    isPrivate: true,
    upcomingEvents: 4,
  },
];

const categories = [
  "All Teams",
  "Environment",
  "Food Security",
  "Education",
  "Healthcare",
  "Youth Development",
  "Elderly Care",
];

const topTeams = [
  {
    name: "Green Warriors",
    impactPoints: 450,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Food for All",
    impactPoints: 320,
    image:
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Tech Mentors",
    impactPoints: 280,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
  },
];

export default function TeamsPage() {
  const router = useRouter();

  return (
    <PageLayout
      title="Volunteer Teams"
      description="Join or create teams to make a bigger impact together"
      actions={
        <Button onClick={() => router.push("/dashboard/teams/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      }
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search teams..."
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
                  className="px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </ScrollArea>

          {/* Teams Grid */}
          <div className="grid gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex gap-6 p-6">
                  <div
                    className="w-24 h-24 rounded-xl bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${team.image})` }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{team.name}</h3>
                      {team.isPrivate && (
                        <Badge
                          variant="secondary"
                          className="bg-background/50 backdrop-blur-sm"
                        >
                          Private
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {team.description}
                    </p>
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{team.members} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span>{team.impactPoints} impact points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span>{team.achievements} achievements</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Badge
                      variant="outline"
                      className="bg-background/50 backdrop-blur-sm"
                    >
                      {team.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 text-sm text-primary hover:opacity-80 transition-opacity"
                      onClick={() => router.push(`/dashboard/teams/${team.id}`)}
                    >
                      View Team
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Teams */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Teams</h3>
            <div className="space-y-4">
              {topTeams.map((team, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${team.image})` }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{team.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {team.impactPoints} points
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Teams</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Active Teams</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">180</p>
                  <p className="text-sm text-muted-foreground">Team Points</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
