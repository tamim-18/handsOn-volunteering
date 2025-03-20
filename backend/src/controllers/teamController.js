const Team = require('../models/Team');


// Create team
exports.createTeam = async (req, res) => {
    try {
        console.log('Creating team with data:', req.body); // Debug log
        console.log('User:', req.user); // Debug log

        const team = new Team({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            isPrivate: req.body.isPrivate,
            creator: req.user.userId,
            members: [{
                user: req.user.userId,
                role: 'admin'
            }]
        });

        await team.save();
        await team.populate('creator', 'name email');
        await team.populate('members.user', 'name email');

        console.log('Team created:', team); // Debug log

        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            data: team
        });
    } catch (error) {
        console.error('Team creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating team',
            error: error.message
        });
    }
};

// Other controller methods...

// Get all teams
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({ isPrivate: false })
            .populate('creator', 'name email')
            .populate('members.user', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: teams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching teams',
            error: error.message
        });
    }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('creator', 'name email')
            .populate('members.user', 'name email')
            .populate('events');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.json({
            success: true,
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching team',
            error: error.message
        });
    }
};

// Join team
exports.joinTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if user is already a member
        if (team.members.some(member => member.user.toString() === req.user.userId)) {
            return res.status(400).json({
                success: false,
                message: 'Already a member of this team'
            });
        }

        team.members.push({
            user: req.user.userId,
            role: 'member',
            joinedAt: new Date()
        });

        await team.save();
        await team.populate('members.user', 'name email');

        res.json({
            success: true,
            message: 'Successfully joined team',
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error joining team',
            error: error.message
        });
    }
};

// Update team
exports.updateTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if user is admin
        const memberInfo = team.members.find(
            member => member.user.toString() === req.user.userId && member.role === 'admin'
        );

        if (!memberInfo) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update team'
            });
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
            .populate('creator', 'name email')
            .populate('members.user', 'name email');

        res.json({
            success: true,
            message: 'Team updated successfully',
            data: updatedTeam
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating team',
            error: error.message
        });
    }
};

// Add achievement
exports.addAchievement = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if user is admin
        const isAdmin = team.members.some(
            member => member.user.toString() === req.user.userId && member.role === 'admin'
        );

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to add achievements'
            });
        }

        team.achievements.push({
            title: req.body.title,
            description: req.body.description,
            date: new Date()
        });

        await team.save();

        res.json({
            success: true,
            message: 'Achievement added successfully',
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding achievement',
            error: error.message
        });
    }
};