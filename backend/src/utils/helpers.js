const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Authentication Helpers
 */
// Update the generateToken function
const generateToken = (userId) => {
    return jwt.sign(
        { userId: userId.toString() }, // Ensure userId is a string
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

/**
 * Password Helpers
 */
const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Password hashing failed');
    }
};

const comparePasswords = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Response Formatters
 */
const formatSuccess = (data = null, message = 'Success') => ({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
});

const formatError = (message = 'Error occurred', statusCode = 500) => ({
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString()
});

/**
 * Validation Helpers
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    // Minimum 6 characters, at least one uppercase letter, one lowercase letter, and one number
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return passwordRegex.test(password);
};

const isValidObjectId = (id) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
};

/**
 * Data Sanitization
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value);
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'string' ? sanitizeInput(item) : item
            );
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};

/**
 * Date Helpers
 */
const formatDate = (date) => {
    return new Date(date).toISOString();
};

const isDatePast = (date) => {
    return new Date(date) < new Date();
};

const calculateDateDifference = (date1, date2) => {
    const diff = Math.abs(new Date(date1) - new Date(date2));
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    };
};

/**
 * Pagination Helper
 */
const paginateResults = (array, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {
        data: array.slice(startIndex, endIndex),
        pagination: {
            total: array.length,
            page: parseInt(page),
            totalPages: Math.ceil(array.length / limit),
            hasMore: endIndex < array.length
        }
    };

    return results;
};

/**
 * Error Handler
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Constants
 */
const CONSTANTS = {
    ROLES: {
        USER: 'user',
        ADMIN: 'admin',
        VOLUNTEER: 'volunteer'
    },
    EVENT_STATUS: {
        UPCOMING: 'upcoming',
        ONGOING: 'ongoing',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
    },
    HELP_REQUEST_STATUS: {
        OPEN: 'open',
        IN_PROGRESS: 'in-progress',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
    },
    URGENCY_LEVELS: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        URGENT: 'urgent'
    }
};

/**
 * Logger
 */
const logger = {
    info: (message, meta = {}) => {
        console.log(new Date().toISOString(), 'INFO:', message, meta);
    },
    error: (message, meta = {}) => {
        console.error(new Date().toISOString(), 'ERROR:', message, meta);
    },
    warn: (message, meta = {}) => {
        console.warn(new Date().toISOString(), 'WARN:', message, meta);
    },
    debug: (message, meta = {}) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(new Date().toISOString(), 'DEBUG:', message, meta);
        }
    }
};

module.exports = {
    // Auth
    generateToken,
    verifyToken,
    hashPassword,
    comparePasswords,

    // Response
    formatSuccess,
    formatError,

    // Validation
    isValidEmail,
    isValidPassword,
    isValidObjectId,

    // Sanitization
    sanitizeInput,
    sanitizeObject,

    // Date
    formatDate,
    isDatePast,
    calculateDateDifference,

    // Pagination
    paginateResults,

    // Error
    AppError,

    // Constants
    CONSTANTS,

    // Logger
    logger
};