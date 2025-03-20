"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronLeft,
  Upload,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const categories = [
  "Education",
  "Environment",
  "Health",
  "Social Services",
  "Arts & Culture",
  "Sports & Recreation",
  "Animal Welfare",
  "Community Development",
  "Disaster Relief",
  "Other",
];

const frequencies = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    maxParticipants: "",
    contactInfo: "",
    isRecurring: false,
    recurringDetails: {
      frequency: "",
      endDate: "",
    },
    requirements: [] as string[],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to create events");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("time", formData.time);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("maxParticipants", formData.maxParticipants);
      formDataToSend.append("contactInfo", formData.contactInfo);
      formDataToSend.append("isRecurring", String(isRecurring));
      formDataToSend.append("requirements", JSON.stringify(requirements));

      if (isRecurring) {
        formDataToSend.append(
          "recurringDetails",
          JSON.stringify(formData.recurringDetails)
        );
      }

      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      toast.success("Event created successfully");
      router.push(`/dashboard/events/${data.data._id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Event</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to create a new volunteer event
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-card rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="Enter event title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              placeholder="Enter event description"
              className="min-h-[120px]"
            />
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-card rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                placeholder="Enter event location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData({ ...formData, maxParticipants: e.target.value })
                }
                required
                placeholder="Enter maximum number of participants"
              />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-card rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">Requirements</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddRequirement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted"
                >
                  <span className="flex-1">{req}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Details</Label>
            <Input
              id="contactInfo"
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              required
              placeholder="Enter contact information (phone, email, etc.)"
            />
          </div>
        </div>

        {/* Recurring Event */}
        <div className="bg-card rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recurring Event</h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="isRecurring">Make this event recurring</Label>
              <Switch
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.recurringDetails.frequency}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      recurringDetails: {
                        ...formData.recurringDetails,
                        frequency: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.recurringDetails.endDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurringDetails: {
                        ...formData.recurringDetails,
                        endDate: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Event Image */}
        <div className="bg-card rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">Event Image</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 rounded-lg"
                    />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
