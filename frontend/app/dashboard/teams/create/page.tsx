"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Lock, Tag, Image as ImageIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { uploadImage } from "@/lib/cloudinary";

const categories = [
  "Environment",
  "Food Security",
  "Education",
  "Healthcare",
  "Elderly Care",
  "Youth Development",
  "Animal Welfare",
  "Arts & Culture",
  "Disaster Relief",
  "Social Justice",
];

export default function CreateTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    isPrivate: false,
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        setImage(imageUrl);
      } catch (error) {
        toast.error("Failed to upload image");
      }
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to create a team");
        return;
      }

      const response = await fetch("http://localhost:5000/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          image,
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create team");
      }

      toast.success("Team created successfully!");
      router.push("/dashboard/teams");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create team"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Create Team"
      description="Create a new team to collaborate with other volunteers"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter team name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your team's mission and goals..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Team Image</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {image && (
                  <div className="relative group">
                    <img
                      src={image}
                      alt="Team image"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {!image && (
                  <label className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </label>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tags</h2>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!newTag}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Privacy Settings</h2>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) =>
                    setFormData({ ...formData, isPrivate: e.target.checked })
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isPrivate" className="text-sm">
                  Make this team private
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Team"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </PageLayout>
  );
}
