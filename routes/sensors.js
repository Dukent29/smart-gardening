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
const thresholds = {
    temperature: { low: 18, high: 30 },
    humidity: { low: 40, high: 70 },
    soilMoisture: { low: 25, high: 60 },
    light: { low: 200, high: 800 }
};
// ✅ Fonction pour déterminer le status
function getStatus(type, value) {
    const t = thresholds[type];
    if (!t) return 'OK'; // fallback si pas défini
    if (value < t.low) return 'LOW';
    if (value > t.high) return 'CRITICAL';
    return 'OK';
}
// ✅ Route POST pour mocker les données capteurs
router.post('/mock/:plantId', async (req, res) => {
    const plantId = parseInt(req.params.plantId);

    if (isNaN(plantId)) {
        return res.status(400).json({ success: false, message: 'Invalid plant ID' });
    }

    // 🎲 Données simulées
    const mockData = {
        temperature: parseFloat((Math.random() * 10 + 20).toFixed(1)),      // 20–30°C
        humidity: parseFloat((Math.random() * 20 + 40).toFixed(1)),         // 40–60%
        soilMoisture: parseFloat((Math.random() * 30 + 20).toFixed(1)),     // 20–50%
        light: Math.floor(Math.random() * 1000),                            // 0–1000 lux
        timestamp: new Date()
    };

    // Construction dynamique des capteurs à insérer
    const sensorValues = [
        {
            type: sensorTypes.temperature,
            value: mockData.temperature,
            status: getStatus('temperature', mockData.temperature)
        },
        {
            type: sensorTypes.humidity,
            value: mockData.humidity,
            status: getStatus('humidity', mockData.humidity)
        },
        {
            type: sensorTypes.soilMoisture,
            value: mockData.soilMoisture,
            status: getStatus('soilMoisture', mockData.soilMoisture)
        },
        {
            type: sensorTypes.light,
            value: mockData.light,
            status: getStatus('light', mockData.light)
        }
    ];

    //  Construction SQL dynamique
    const insertValues = [];
    const params = [plantId];
    let paramIndex = 2;

    for (const sensor of sensorValues) {
        insertValues.push(`($1, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
        params.push(sensor.type, sensor.value, sensor.status, mockData.timestamp);
    }

    const query = `
    INSERT INTO sensors (plant_id, sensor_type, value, status, timestamp)
    VALUES ${insertValues.join(', ')}
  `;

    //  Envoi vers la BDD
    try {
        await db.query(query, params);
        res.json({
            success: true,
            data: sensorValues
        });
    } catch (err) {
        console.error('[ERROR] Inserting mock sensor data:', err);
        res.status(500).json({ success: false, message: 'Error inserting mock data' });
    }
});


module.exports = router;
