const express = require('express');
const router = express.Router();
const helpRequestController = require('../controllers/helpRequestController');
const auth = require('../middleware/auth');

// Remove the PUT route for now since we haven't implemented updateHelpRequest
router.post('/', auth, helpRequestController.createHelpRequest);
router.get('/', helpRequestController.getAllHelpRequests);
router.get('/:id', helpRequestController.getHelpRequestById);
router.post('/:id/volunteer', auth, helpRequestController.volunteerForHelp);

module.exports = router;