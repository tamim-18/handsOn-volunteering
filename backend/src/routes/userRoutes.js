const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getVolunteerHistory,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/volunteer-history", protect, getVolunteerHistory);

module.exports = router;
