const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your email first",
        });
      }

      // Check if user is active
      if (user.status !== "active") {
        return res.status(401).json({
          success: false,
          message: "Your account is not active",
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Rate limiting middleware
const rateLimit = (limit, windowMs) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    requests.forEach((timestamp, key) => {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    });

    // Get requests in window
    const requestsInWindow = Array.from(requests.values()).filter(
      (timestamp) => timestamp > windowStart
    ).length;

    if (requestsInWindow >= limit) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
      });
    }

    requests.set(ip, now);
    next();
  };
};

// Export all middleware functions
module.exports = {
  protect,
  authorize,
  rateLimit,
};
