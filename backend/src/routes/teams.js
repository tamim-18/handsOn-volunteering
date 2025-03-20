const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');

console.log('Team routes loaded'); // Debug log

// Create team
router.post('/', auth, teamController.createTeam);

// Get all teams
router.get('/', teamController.getAllTeams);

// Get specific team
router.get('/:id', teamController.getTeamById);

// Join team
router.post('/:id/join', auth, teamController.joinTeam);

// Update team
router.put('/:id', auth, teamController.updateTeam);

module.exports = router;