const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const mockController = require('../controllers/sensorMockController');

router.post('/sensors/:plant_id', authenticateJWT, mockController.insertMockSensors);

module.exports = router;
