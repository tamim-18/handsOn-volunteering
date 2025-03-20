const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.register);

router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, [
    body('name').optional().trim(),
    body('bio').optional().trim(),
    body('skills').optional().isArray(),
    body('causes').optional().isArray()
], authController.updateProfile);

module.exports = router;