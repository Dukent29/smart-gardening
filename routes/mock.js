const express = require('express');
const router = express.Router();
const Sensor = require('../models/sensorModel'); // ✅ Ton modèle Mongoose
const { authenticateJWT } = require('../middleware/auth'); // ✅ Auth middleware si tu veux le garder

// ✅ Capteurs qu’on veut simuler
const sensorTypes = {
    temperature: 'temperature',
    humidity: 'humidity',
    soilMoisture: 'soil_moisture',
    light: 'light'
};

// ✅ Seuils pour déterminer le statut
const thresholds = {
    temperature: { low: 18, high: 30 },
    humidity: { low: 40, high: 70 },
    soilMoisture: { low: 25, high: 60 },
    light: { low: 200, high: 800 }
};

// ✅ Fonction de statut dynamique
function getStatus(type, value) {
    const t = thresholds[type];
    if (!t) return 'OK';
    if (value < t.low) return 'LOW';
    if (value > t.high) return 'CRITICAL';
    return 'OK';
}

// ✅ Route : POST /mock/sensors/:plant_id
router.post('/sensors/:plant_id', authenticateJWT, async (req, res) => {
    const plant_id = parseInt(req.params.plant_id);

    if (isNaN(plant_id)) {
        return res.status(400).json({ success: false, message: 'Invalid plant ID' });
    }

    // ✅ Génère les valeurs mockées
    const timestamp = new Date();
    const generatedSensors = [
        {
            sensor_type: sensorTypes.temperature,
            value: parseFloat((Math.random() * 10 + 20).toFixed(1)) // 20–30
        },
        {
            sensor_type: sensorTypes.humidity,
            value: parseFloat((Math.random() * 30 + 35).toFixed(1)) // 35–65
        },
        {
            sensor_type: sensorTypes.soilMoisture,
            value: parseFloat((Math.random() * 40 + 20).toFixed(1)) // 20–60
        },
        {
            sensor_type: sensorTypes.light,
            value: Math.floor(Math.random() * 1000) // 0–1000
        }
    ];

    // ✅ Transforme en objets prêts pour Mongo
    const sensorsToInsert = generatedSensors.map(sensor => ({
        plant_id,
        sensor_type: sensor.sensor_type,
        value: sensor.value,
        status: getStatus(sensor.sensor_type, sensor.value),
        timestamp
    }));

    try {
        await Sensor.insertMany(sensorsToInsert);

        res.status(200).json({
            success: true,
            inserted: sensorsToInsert
        });
    } catch (error) {
        console.error('[ERROR] Mongo insert fail:', error);
        res.status(500).json({ success: false, message: 'Failed to insert sensors' });
    }
});

module.exports = router;
