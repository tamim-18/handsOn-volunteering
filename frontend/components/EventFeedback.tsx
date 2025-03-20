"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  StarHalf,
  MessageSquare,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Feedback {
  _id: string;
  rating: number;
  comment: string;
  photos: string[];
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface EventFeedbackProps {
  eventId: string;
  isParticipant: boolean;
}

export function EventFeedback({ eventId, isParticipant }: EventFeedbackProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  useEffect(() => {
    fetchFeedback();
  }, [eventId]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/feedback`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch feedback");
      }

      setFeedback(data.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to provide feedback");
        return;
      }

      const formData = new FormData();
      formData.append("rating", rating.toString());
      formData.append("comment", comment);
      newPhotos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/feedback`,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      toast.success(
        editing
          ? "Feedback updated successfully"
          : "Feedback submitted successfully"
      );
      setRating(0);
      setComment("");
      setPhotos([]);
      setNewPhotos([]);
      setEditing(null);
      fetchFeedback();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit feedback"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: Feedback) => {
    setEditing(item._id);
    setRating(item.rating);
    setComment(item.comment);
    setPhotos(item.photos);
  };

  const handleDelete = async (feedbackId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to delete feedback");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/feedback`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete feedback");
      }

      toast.success("Feedback deleted successfully");
      fetchFeedback();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete feedback"
      );
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewPhotos(Array.from(files));
      const newPhotoUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPhotos([...photos, ...newPhotoUrls]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setNewPhotos(newPhotos.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userFeedback = feedback.find((f) => f.user._id === currentUser._id);

  return (
    <div className="space-y-8">
      {/* Feedback Form */}
      {isParticipant && !userFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg p-6 space-y-6"
        >
          <h2 className="text-2xl font-semibold">Share Your Experience</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    {star <= rating ? (
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    ) : (
                      <Star className="h-6 w-6 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Photos</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Feedback photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <label className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      multiple
                    />
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </label>
                )}
              </div>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </form>
        </motion.div>
      )}

      {/* Feedback List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Feedback</h2>
        <ScrollArea className="h-[600px]">
          <div className="space-y-6">
            {feedback.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {item.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {item.user._id === currentUser._id && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= item.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground">{item.comment}</p>

                {item.photos && item.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {item.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Feedback photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
