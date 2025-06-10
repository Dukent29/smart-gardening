const express = require('express');
const router = express.Router();
const SensorController = require('../controllers/sensorController');
const { authenticateJWT } = require('../middleware/auth');
const db = require('../config/pg');
const sensorTypes = {
    temperature: 'temperature',
    humidity: 'humidity',
    light: 'light',
    soilMoisture: 'soil_moisture'
};


router.get('/:plant_id/sensors', authenticateJWT, SensorController.getSensorDataByPlant);
router.get('/simulate/:plant_id', authenticateJWT, SensorController.automatePlantCare);
router.post('/mock/:plantId', async (req, res) => {
    const plantId = parseInt(req.params.plantId);

    if (isNaN(plantId)) {
        return res.status(400).json({ success: false, message: 'Invalid plant ID' });
    }

    const mockData = {
        plant_id: plantId,
        temperature: parseFloat((Math.random() * 10 + 20).toFixed(1)),
        humidity: parseFloat((Math.random() * 20 + 40).toFixed(1)),
        soilMoisture: parseFloat((Math.random() * 30 + 20).toFixed(1)),
        light: Math.floor(Math.random() * 1000),
        timestamp: new Date()
    };

    // INSERT dans la table sensors
    try {
        await db.query(
            `INSERT INTO sensors (plant_id, sensor_type, value, status, timestamp)
             VALUES
                 ($1, $2, $3, 'OK', $7),
                 ($1, $4, $5, 'OK', $7),
                 ($1, $6, $8, 'OK', $7)`,
            [
                plantId,
                sensorTypes.temperature, mockData.temperature,
                sensorTypes.humidity, mockData.humidity,
                sensorTypes.soilMoisture, mockData.timestamp,
                mockData.soilMoisture
            ]
        );

        res.json({ success: true, data: mockData });
    } catch (err) {
        console.error('[ERROR] Inserting mock sensor data:', err);
        res.status(500).json({ success: false, message: 'Error inserting mock data' });
    }
});


module.exports = router;
