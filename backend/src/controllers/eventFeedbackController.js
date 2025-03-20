const EventFeedback = require("../models/EventFeedback");
const Event = require("../models/Event");
const User = require("../models/User");

// @desc    Create event feedback
// @route   POST /api/events/:id/feedback
// @access  Private
const createFeedback = async (req, res) => {
  try {
    const { rating, comment, photos } = req.body;
    const eventId = req.params.id;

    // Check if user participated in the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only event participants can provide feedback",
      });
    }

    // Check if user has already provided feedback
    const existingFeedback = await EventFeedback.findOne({
      event: eventId,
      user: req.user._id,
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "You have already provided feedback for this event",
      });
    }

    const feedback = await EventFeedback.create({
      event: eventId,
      user: req.user._id,
      rating,
      comment,
      photos,
    });

    // Update event average rating
    const allFeedback = await EventFeedback.find({ event: eventId });
    const averageRating =
      allFeedback.reduce((acc, curr) => acc + curr.rating, 0) /
      allFeedback.length;

    await Event.findByIdAndUpdate(eventId, {
      averageRating,
      totalRatings: allFeedback.length,
    });

    // Add points to user for providing feedback
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 10 },
    });

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get event feedback
// @route   GET /api/events/:id/feedback
// @access  Public
const getEventFeedback = async (req, res) => {
  try {
    const feedback = await EventFeedback.find({ event: req.params.id })
      .populate("user", "name email")
      .sort("-createdAt");

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update event feedback
// @route   PUT /api/events/:id/feedback
// @access  Private
const updateFeedback = async (req, res) => {
  try {
    const { rating, comment, photos } = req.body;
    const feedback = await EventFeedback.findOne({
      event: req.params.id,
      user: req.user._id,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    feedback.rating = rating;
    feedback.comment = comment;
    feedback.photos = photos;

    await feedback.save();

    // Update event average rating
    const allFeedback = await EventFeedback.find({ event: req.params.id });
    const averageRating =
      allFeedback.reduce((acc, curr) => acc + curr.rating, 0) /
      allFeedback.length;

    await Event.findByIdAndUpdate(req.params.id, {
      averageRating,
      totalRatings: allFeedback.length,
    });

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete event feedback
// @route   DELETE /api/events/:id/feedback
// @access  Private
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await EventFeedback.findOneAndDelete({
      event: req.params.id,
      user: req.user._id,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Update event average rating
    const allFeedback = await EventFeedback.find({ event: req.params.id });
    const averageRating =
      allFeedback.length > 0
        ? allFeedback.reduce((acc, curr) => acc + curr.rating, 0) /
          allFeedback.length
        : 0;

    await Event.findByIdAndUpdate(req.params.id, {
      averageRating,
      totalRatings: allFeedback.length,
    });

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getEventFeedback,
  updateFeedback,
  deleteFeedback,
};
