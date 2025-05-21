// routes/actions.js
const express = require('express');
const router = express.Router();
const ActionController = require('../controllers/actionController');
const { authenticateJWT } = require('../middleware/auth');

router.get('/:plant_id/actions', authenticateJWT, ActionController.getActionsByPlant);

module.exports = router;
