const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const SensorController = require('../controllers/SensorController');
const Sensor = require('../models/sensorModel'); // Import du modèle Sensor

router.get('/simulate/:plant_id', authenticateJWT, SensorController.simulateAndAutomate);
router.post('/force-test/:plant_id', async (req, res) => {
    const { plant_id } = req.params;
    const testSensors = [
        { plant_id, sensor_type: 'temperature', value: 15, timestamp: new Date() },
        { plant_id, sensor_type: 'humidity', value: 80, timestamp: new Date() },
        { plant_id, sensor_type: 'soil_moisture', value: 20, timestamp: new Date() },
        { plant_id, sensor_type: 'light', value: 900, timestamp: new Date() }
    ];

    await Sensor.insertMany(testSensors);
    res.json({ success: true, inserted: testSensors });
});


module.exports = router;