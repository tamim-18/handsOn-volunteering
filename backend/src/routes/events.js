const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

// Debug log
console.log('Registering event routes');

// Create event
router.post('/', auth, eventController.createEvent);

// Get all events
router.get('/', eventController.getAllEvents);

// Get single event
router.get('/:id', eventController.getEventById);

// Update event
router.put('/:id', auth, eventController.updateEvent);

// Join event
router.post('/:id/join', auth, eventController.joinEvent);

module.exports = router;