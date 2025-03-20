const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEvent,
  joinEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getEvents);
router.get("/:id", getEvent);

// Protected routes
router.post("/", protect, createEvent);
router.post("/:id/join", protect, joinEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.get("/user/me", protect, getUserEvents);

module.exports = router;
