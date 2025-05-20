// sensor routes
// routes/sensors.js
const express = require('express');
const router = express.Router();
const SensorController = require('../controllers/sensorController');
const { authenticateJWT } = require('../middleware/auth');

router.get('/:plant_id/sensors', authenticateJWT, SensorController.getSensorDataByPlant);

module.exports = router;
