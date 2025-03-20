"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Award,
  Heart,
  Edit2,
  Save,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  skills: string[];
  causes: string[];
  volunteerHours: number;
  points: number;
  createdAt: string;
}

const availableSkills = [
  "Teaching",
  "First Aid",
  "Event Planning",
  "Public Speaking",
  "Project Management",
  "Fundraising",
  "Social Media",
  "Photography",
  "Translation",
  "Technical Skills",
];

const availableCauses = [
  "Environment",
  "Education",
  "Healthcare",
  "Elderly Care",
  "Youth Development",
  "Food Security",
  "Animal Welfare",
  "Arts & Culture",
  "Disaster Relief",
  "Social Justice",
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [newCause, setNewCause] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view your profile");
        return;
      }

      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setProfile(data.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !profile) return;

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          skills: profile.skills,
          causes: profile.causes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  const addSkill = () => {
    if (newSkill && profile && !profile.skills.includes(newSkill)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: profile.skills.filter((s) => s !== skill),
      });
    }
  };

  const addCause = () => {
    if (newCause && profile && !profile.causes.includes(newCause)) {
      setProfile({
        ...profile,
        causes: [...profile.causes, newCause],
      });
      setNewCause("");
    }
  };

  const removeCause = (cause: string) => {
    if (profile) {
      setProfile({
        ...profile,
        causes: profile.causes.filter((c) => c !== cause),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile information and preferences
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() =>
            isEditing ? handleUpdateProfile() : setIsEditing(true)
          }
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Basic Information */}
        <div className="bg-card rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input value={profile.email} disabled className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-card rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                disabled={!isEditing}
              />
              <Button
                type="button"
                onClick={addSkill}
                disabled={!isEditing || !newSkill}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Causes */}
        <div className="bg-card rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Causes You Support</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCause}
                onChange={(e) => setNewCause(e.target.value)}
                placeholder="Add a cause"
                disabled={!isEditing}
              />
              <Button
                type="button"
                onClick={addCause}
                disabled={!isEditing || !newCause}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.causes.map((cause) => (
                <Badge
                  key={cause}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {cause}
                  {isEditing && (
                    <button
                      onClick={() => removeCause(cause)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-5 w-5" />
              <h3 className="font-medium">Volunteer Hours</h3>
            </div>
            <p className="text-3xl font-bold mt-2">{profile.volunteerHours}</p>
          </div>
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="h-5 w-5" />
              <h3 className="font-medium">Impact Points</h3>
            </div>
            <p className="text-3xl font-bold mt-2">{profile.points}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
