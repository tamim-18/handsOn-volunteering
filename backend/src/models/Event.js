const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
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
      ],
    },
    image: {
      type: String,
      trim: true,
    },
    maxParticipants: {
      type: Number,
      required: [true, "Maximum participants is required"],
      min: [1, "Maximum participants must be at least 1"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    contactInfo: {
      type: String,
      required: [true, "Contact information is required"],
      trim: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringDetails: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
      },
      endDate: Date,
    },
    // New rating fields
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    // New fields for event highlights
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    impactMetrics: {
      peopleHelped: {
        type: Number,
        default: 0,
      },
      hoursContributed: {
        type: Number,
        default: 0,
      },
      resourcesCollected: {
        type: Number,
        default: 0,
      },
    },
    // New field for event tags
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // New field for event visibility
    visibility: {
      type: String,
      enum: ["public", "private", "organization"],
      default: "public",
    },
    // New field for event registration deadline
    registrationDeadline: {
      type: Date,
    },
    // New field for event cancellation policy
    cancellationPolicy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ visibility: 1 });

// Virtual for checking if event is full
eventSchema.virtual("isFull").get(function () {
  return this.participants.length >= this.maxParticipants;
});

// Virtual for checking if registration is closed
eventSchema.virtual("isRegistrationClosed").get(function () {
  return this.registrationDeadline && new Date() > this.registrationDeadline;
});

// Method to check if user can join
eventSchema.methods.canJoin = function (userId) {
  return (
    this.status === "upcoming" &&
    !this.isFull &&
    !this.isRegistrationClosed &&
    !this.participants.includes(userId)
  );
};

module.exports = mongoose.model("Event", eventSchema);
