const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const simulateEffectController = require('../controllers/simulateEffectController');

// Route POST pour appliquer l'effet d'une action manuelle
// Exemple : POST /plants/:plant_id/apply-action
router.post('/plants/:plant_id/apply-action', authenticateJWT, simulateEffectController.applyActionEffect);

module.exports = router;
