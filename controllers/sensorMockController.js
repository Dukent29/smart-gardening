const Sensor = require('../models/sensorModel');
const SensorController = require('./sensorController');
const { generateMockSensors } = require('../models/sensorMock');

const sensorMockController = {
    insertMockSensors: async (req, res) => {
        const plant_id = parseInt(req.params.plant_id);
        req.params.plant_id = plant_id; // Pour être sûr
        req.user = req.user || {}; // pour éviter une erreur s'il n’y a pas encore de user (dev only)

        if (isNaN(plant_id)) {
            return res.status(400).json({ success: false, message: 'Invalid plant ID' });
        }

        try {
            const existing = await Sensor.findOne({ plant_id });
            const isFirstTime = !existing;

            const sensors = generateMockSensors(plant_id, isFirstTime);
            await Sensor.insertMany(sensors);

            if (isFirstTime) {
                console.log('🎉 First-time sensor init – simulating...');
                // Appelle simulateAndAutomate directement
                return SensorController.simulateAndAutomate(req, res);
            }

            // Sinon réponse normale
            res.status(200).json({
                success: true,
                message: 'Mock sensor data inserted successfully',
                inserted: sensors
            });

        } catch (err) {
            console.error('[MockSensor Error]', err);
            res.status(500).json({ success: false, message: 'Error inserting mock sensors' });
        }
    }
};
module.exports = sensorMockController;
