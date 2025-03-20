const HelpRequest = require('../models/HelpRequest');

// Create help request
exports.createHelpRequest = async (req, res) => {
    try {
        console.log('Creating help request with data:', {
            body: req.body,
            user: req.user
        });

        const helpRequest = new HelpRequest({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            urgencyLevel: req.body.urgencyLevel,
            requiredSkills: req.body.requiredSkills,
            volunteersNeeded: req.body.volunteersNeeded,
            creator: req.user.userId,
            status: 'open'
        });

        await helpRequest.save();
        await helpRequest.populate('creator', 'name email');

        res.status(201).json({
            success: true,
            message: 'Help request created successfully',
            data: helpRequest
        });
    } catch (error) {
        console.error('Create help request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating help request',
            error: error.message
        });
    }
};

// Get all help requests
exports.getAllHelpRequests = async (req, res) => {
    try {
        const helpRequests = await HelpRequest.find()
            .populate('creator', 'name email')
            .populate('volunteers', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: helpRequests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching help requests',
            error: error.message
        });
    }
};

// Get help request by ID
exports.getHelpRequestById = async (req, res) => {
    try {
        const helpRequest = await HelpRequest.findById(req.params.id)
            .populate('creator', 'name email')
            .populate('volunteers', 'name email');

        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: 'Help request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: helpRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching help request',
            error: error.message
        });
    }
};

// Volunteer for help request
exports.volunteerForHelp = async (req, res) => {
    try {
        const helpRequest = await HelpRequest.findById(req.params.id);

        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: 'Help request not found'
            });
        }

        // Check if user is already volunteering
        if (helpRequest.volunteers.includes(req.user.userId)) {
            return res.status(400).json({
                success: false,
                message: 'Already volunteered for this request'
            });
        }

        helpRequest.volunteers.push(req.user.userId);

        // Update status if enough volunteers
        if (helpRequest.volunteers.length >= helpRequest.volunteersNeeded) {
            helpRequest.status = 'in-progress';
        }

        await helpRequest.save();
        await helpRequest.populate('volunteers', 'name email');

        res.status(200).json({
            success: true,
            message: 'Successfully volunteered for help request',
            data: helpRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error volunteering for help request',
            error: error.message
        });
    }
};