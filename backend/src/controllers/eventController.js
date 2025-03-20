const Event = require('../models/Event');
const mongoose = require('mongoose');

// Create Event
exports.createEvent = async (req, res) => {
    try {
        // Debug logs
        console.log('1. Request body:', req.body);
        console.log('2. Auth user:', req.user);

        if (!req.user || !req.user.userId) {
            console.log('3. Authentication failed - no user ID');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Validate required fields
        const { title, description, date, location, category } = req.body;

        if (!title || !description || !date || !location || !category) {
            console.log('4. Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Create event object
        const eventData = {
            title,
            description,
            date: new Date(date),
            location,
            category,
            creator: req.user.userId,
            participants: [req.user.userId]
        };

        console.log('5. Event data to be saved:', eventData);

        // Create and save the event
        const event = new Event(eventData);
        console.log('6. Created event instance:', event);

        const savedEvent = await event.save();
        console.log('7. Saved event:', savedEvent);

        // Populate creator details
        await savedEvent.populate('creator', 'name email');
        console.log('8. Populated event:', savedEvent);

        return res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: savedEvent
        });

    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            errors: error.errors
        });

        return res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message,
            details: error.errors
        });
    }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('creator', 'name email')
            .populate('participants', 'name email')
            .sort({ date: 1 });

        return res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
};

// Get single event
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('creator', 'name email')
            .populate('participants', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
};



exports.updateEvent = async (req, res) => {
    try {
        console.log('Update request received:', {
            eventId: req.params.id,
            body: req.body,
            user: req.user
        });

        // Validate event ID
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        // Find event
        const event = await Event.findById(req.params.id);
        console.log('Found event:', event);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check authorization
        if (event.creator.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        // Update event
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status,
                    location: req.body.location
                }
            },
            { new: true }
        ).populate('creator', 'name email')
            .populate('participants', 'name email');

        console.log('Updated event:', updatedEvent);

        return res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: updatedEvent
        });

    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
};

// Join event
exports.joinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is already a participant
        if (event.participants.includes(req.user.userId)) {
            return res.status(400).json({
                success: false,
                message: 'Already joined this event'
            });
        }

        // Add user to participants
        event.participants.push(req.user.userId);
        await event.save();

        // Populate participant details
        await event.populate('participants', 'name email');

        return res.status(200).json({
            success: true,
            message: 'Successfully joined event',
            data: event
        });
    } catch (error) {
        console.error('Error joining event:', error);
        return res.status(500).json({
            success: false,
            message: 'Error joining event',
            error: error.message
        });
    }
};



