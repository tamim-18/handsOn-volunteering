const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  updateDetails,
  updatePassword,
  logout,
} = require("../controllers/authController");
const { protect, rateLimit } = require("../middleware/authMiddleware");

// Rate limiting configuration
const loginLimiter = rateLimit(5, 15 * 60 * 1000); // 5 requests per 15 minutes
const registerLimiter = rateLimit(3, 60 * 60 * 1000); // 3 requests per hour

// Validation middleware
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateDetailsValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email").optional().isEmail().withMessage("Please enter a valid email"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
];

const updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

// Public routes
router.post("/register", registerLimiter, registerValidation, register);
router.post("/login", loginLimiter, loginValidation, login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", loginLimiter, forgotPassword);
router.put("/reset-password", resetPassword);

// Protected routes
router.use(protect); // Apply protection to all routes below this
router.get("/me", getMe);
router.put("/update-details", updateDetailsValidation, updateDetails);
router.put("/update-password", updatePasswordValidation, updatePassword);
router.get("/logout", logout);

module.exports = router;
