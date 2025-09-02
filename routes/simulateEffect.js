const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const simulateEffectController = require('../controllers/simulateEffectController');


router.post('/plants/:plant_id/apply-action', authenticateJWT, simulateEffectController.applyActionEffect);

module.exports = router;
