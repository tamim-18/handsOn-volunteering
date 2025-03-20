const Event = require("../models/Event");
const User = require("../models/User");

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      image,
      maxParticipants,
      requirements,
      contactInfo,
      isRecurring,
      recurringDetails,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      image,
      maxParticipants,
      requirements,
      contactInfo,
      isRecurring,
      recurringDetails,
      creator: req.user._id,
    });

    // Add event to user's created events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdEvents: event._id },
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { category, status, search, date, page = 1, limit = 10 } = req.query;

    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    // Get events with pagination
    const events = await Event.find(query)
      .populate("creator", "name email")
      .populate("participants", "name email")
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: events,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("creator", "name email")
      .populate("participants", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Join an event
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user can join
    if (!event.canJoin(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "Cannot join this event",
      });
    }

    // Add user to participants
    event.participants.push(req.user._id);
    await event.save();

    // Add event to user's joined events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { joinedEvents: event._id },
    });

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the creator
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event",
      });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      event[key] = req.body[key];
    });

    await event.save();

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the creator
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event",
      });
    }

    // Remove event from users' joined events
    await User.updateMany(
      { joinedEvents: event._id },
      { $pull: { joinedEvents: event._id } }
    );

    // Remove event from creator's created events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { createdEvents: event._id },
    });

    await event.remove();

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's events (created and joined)
// @route   GET /api/events/user/me
// @access  Private
const getUserEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("createdEvents")
      .populate("joinedEvents");

    res.json({
      success: true,
      data: {
        createdEvents: user.createdEvents,
        joinedEvents: user.joinedEvents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  joinEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
};
