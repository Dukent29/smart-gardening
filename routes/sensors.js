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

    // Génération des données mock
    const mockData = {
        temperature: parseFloat((Math.random() * 10 + 20).toFixed(1)),    // 20 à 30°C
        humidity: parseFloat((Math.random() * 20 + 40).toFixed(1)),       // 40 à 60%
        soilMoisture: parseFloat((Math.random() * 30 + 20).toFixed(1)),   // 20 à 50%
        light: Math.floor(Math.random() * 1000),                          // 0 à 1000 lux
        timestamp: new Date()
    };

    // Tableau dynamique des capteurs à insérer
    const sensorValues = [
        { type: sensorTypes.temperature, value: mockData.temperature },
        { type: sensorTypes.humidity, value: mockData.humidity },
        { type: sensorTypes.soilMoisture, value: mockData.soilMoisture },
        { type: sensorTypes.light, value: mockData.light }
    ];

    // Construction dynamique des valeurs pour la requête SQL
    const insertValues = [];
    const params = [plantId]; // $1 = plantId
    let paramIndex = 2; // commence à $2 car $1 est déjà pris

    for (const sensor of sensorValues) {
        // Ajoute une ligne à VALUES genre: ($1, $2, $3, 'OK', $4)
        insertValues.push(`($1, $${paramIndex++}, $${paramIndex++}, 'OK', $${paramIndex++})`);
        // Ajoute les vraies valeurs dans l’ordre
        params.push(sensor.type, sensor.value, mockData.timestamp);
    }

    // Requête SQL finale
    const query = `
    INSERT INTO sensors (plant_id, sensor_type, value, status, timestamp)
    VALUES ${insertValues.join(', ')}
  `;

    try {
        await db.query(query, params);
        res.json({ success: true, data: mockData });
    } catch (err) {
        console.error('[ERROR] Inserting mock sensor data:', err);
        res.status(500).json({ success: false, message: 'Error inserting mock data' });
    }
});


module.exports = router;
