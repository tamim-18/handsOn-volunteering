const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't return password in queries by default
    },
    avatar: {
      type: String,
      default: "", // Default avatar URL can be set here
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    causes: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      trim: true,
    },
    volunteerHours: {
      type: Number,
      default: 0,
    },
    impactPoints: {
      type: Number,
      default: 0,
    },
    eventsJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    eventsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    teams: [
      {
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
        },
        role: {
          type: String,
          enum: ["member", "admin"],
          default: "member",
        },
      },
    ],
    achievements: [
      {
        type: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      eventReminders: {
        type: Boolean,
        default: true,
      },
      visibility: {
        type: String,
        enum: ["public", "private", "connections"],
        default: "public",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ causes: 1 });
userSchema.index({ "teams.team": 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// Generate verification token
userSchema.methods.generateVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  return verificationToken;
};

// Generate password reset token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

// Add impact points
userSchema.methods.addImpactPoints = async function (points) {
  this.impactPoints += points;
  await this.save();
};

// Add volunteer hours
userSchema.methods.addVolunteerHours = async function (hours) {
  this.volunteerHours += hours;
  await this.save();
};

// Check if user has achievement
userSchema.methods.hasAchievement = function (achievementType) {
  return this.achievements.some((a) => a.type === achievementType);
};

// Add achievement
userSchema.methods.addAchievement = async function (achievement) {
  if (!this.hasAchievement(achievement.type)) {
    this.achievements.push(achievement);
    await this.save();
    return true;
  }
  return false;
};

// Get public profile
userSchema.methods.getPublicProfile = function () {
  const profile = this.toObject();
  delete profile.password;
  delete profile.verificationToken;
  delete profile.resetPasswordToken;
  delete profile.resetPasswordExpire;
  return profile;
};

module.exports = mongoose.model("User", userSchema);
