"use client";

import { motion } from "framer-motion";
import { Search, Filter, Users, Trophy, Star, ChevronRight, Plus } from "lucide-react";

const teams = [
  {
    id: 1,
    name: "Green Warriors",
    description: "Dedicated to environmental conservation and sustainability initiatives.",
    category: "Environment",
    members: 12,
    impactPoints: 450,
    achievements: 8,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    isPrivate: false,
    upcomingEvents: 3,
  },
  {
    id: 2,
    name: "Food for All",
    description: "Fighting hunger through food drives and community outreach programs.",
    category: "Food Security",
    members: 8,
    impactPoints: 320,
    achievements: 5,
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&auto=format&fit=crop&q=60",
    isPrivate: false,
    upcomingEvents: 2,
  },
  {
    id: 3,
    name: "Tech Mentors",
    description: "Providing technology education and support to underserved communities.",
    category: "Education",
    members: 15,
    impactPoints: 280,
    achievements: 4,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
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
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Food for All",
    impactPoints: 320,
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Tech Mentors",
    impactPoints: 280,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
  },
];

export default function TeamsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Volunteer Teams</h1>
          <p className="text-muted-foreground mt-2">
            Join or create teams to make a bigger impact together.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="h-5 w-5" />
          Create Team
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search teams..."
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

          {/* Teams Grid */}
          <div className="grid gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl overflow-hidden shadow-sm"
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
                        <span className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{team.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm">
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
                    <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                      {team.category}
                    </span>
                    <button className="flex items-center gap-1 text-sm text-primary hover:opacity-80 transition-opacity">
                      View Team
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Teams */}
          <div className="bg-card rounded-xl p-6">
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
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-xl p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}