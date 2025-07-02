// ✅ controllers/plantSensorsController.js
const Plant = require('../models/plantModel');
const Sensor = require('../models/sensorModel');

// Définition des seuils par capteur
const thresholds = {
    temperature: { low: 18, high: 30 },
    humidity: { low: 40, high: 70 },
    soil_moisture: { low: 25, high: 60 },
    light: { low: 200, high: 800 }
};

// Fonction pour obtenir le status selon la valeur
function getStatus(type, value) {
    const t = thresholds[type];
    if (!t) return 'OK';
    if (value < t.low) return 'LOW';
    if (value > t.high) return 'CRITICAL';
    return 'OK';
}

const plantSensorsController = {
    // 🔁 Retourne toutes les plantes d’un user avec leurs capteurs & status
    getPlantsWithSensors: async (req, res) => {
        const user_id = req.user.userId;

        try {
            const plants = await Plant.getAllByUser(user_id); // PostgreSQL
            const enrichedPlants = [];

            for (const plant of plants) {
                const plant_id = plant.plant_id || plant.id;

                const sensors = await Sensor.find({ plant_id }); // MongoDB

                // Ajout du status à chaque capteur
                const sensorsWithStatus = sensors.map(sensor => ({
                    type: sensor.sensor_type,
                    value: sensor.value,
                    status: getStatus(sensor.sensor_type, sensor.value),
                    timestamp: sensor.timestamp
                }));

                enrichedPlants.push({
                    ...plant,
                    sensors: sensorsWithStatus
                });
            }

            res.status(200).json({
                success: true,
                message: 'Plants and sensors with status retrieved',
                data: enrichedPlants
            });
        } catch (err) {
            console.error('[getPlantsWithSensors Error]', err);
            res.status(500).json({
                success: false,
                message: 'Error retrieving plant data with sensors'
            });
        }
    }
};

module.exports = plantSensorsController;
