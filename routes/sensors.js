const express = require('express');
const router = express.Router();
const SensorController = require('../controllers/sensorController');
const { authenticateJWT } = require('../middleware/auth');

router.get('/:plant_id/sensors', authenticateJWT, SensorController.getSensorDataByPlant);
router.get('/simulate/:plant_id', authenticateJWT, SensorController.automatePlantCare);

module.exports = router;
