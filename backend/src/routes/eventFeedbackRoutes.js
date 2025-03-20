const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getEventFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/eventFeedbackController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/:id/feedback", getEventFeedback);

// Protected routes
router.post("/:id/feedback", protect, createFeedback);
router.put("/:id/feedback", protect, updateFeedback);
router.delete("/:id/feedback", protect, deleteFeedback);

module.exports = router;
