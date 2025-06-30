const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const simulateEffectController = require('../controllers/simulateEffectController');

router.patch('/simulate-response/:plant_id', authenticateJWT, simulateEffectController.applyActionEffect);

module.exports = router;