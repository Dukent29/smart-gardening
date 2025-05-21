const SensorData = require('../models/sensorModel');
const PlantAction = require('../models/actionModel');
const Plant = require('../models/plantModel'); // Assuming the path to plantModel is correct
const Sensor = require('../models/sensorModel'); // Assuming the path to sensorModel is correct



const SensorController = {
    getSensorDataByPlant: async (req, res) => {
        try {
            const user_id = req.user.userId;
            const { plant_id } = req.params;

            // First, check if the plant belongs to the user
            const plant = await Plant.getById(plant_id, user_id);
            if (!plant) {
                return res.status(403).json({ success: false, message: 'Access denied: Plant not found or not yours.' });
            }

            // Now fetch the sensor data for this plant
            const sensorData = await Sensor.getByPlantId(plant_id);
            res.status(200).json({ success: true, data: sensorData });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    automatePlantCare: async (req, res) => {
        const user_id = req.user.userId;
        const { plant_id } = req.params;

        try {
            // Check if the plant belongs to the user
            const plant = await Plant.getById(plant_id, user_id);
            if (!plant) {
                return res.status(403).json({ success: false, message: 'Access denied: Plant not found or not yours.' });
            }

            const sensorData = {
                soilMoisture: Math.random() * 100,
                lightLevel: Math.random() * 100,
            };

            let triggeredActions = [];

            if (sensorData.soilMoisture < 30) {
                await PlantAction.create({
                    plant_id,
                    action: 'Auto-watering triggered due to dry soil.',
                    action_type: 'auto',
                    timestamp: new Date(),
                });
                triggeredActions.push('Watered due to dry soil');
            }

            if (sensorData.lightLevel < 20) {
                await PlantAction.create({
                    plant_id,
                    action: 'Auto-adjusted lighting due to low light.',
                    action_type: 'auto',
                    timestamp: new Date(),
                });
                triggeredActions.push('Adjusted lighting');
            }

            res.status(200).json({
                success: true,
                message: 'Automation check complete',
                sensorData,
                triggeredActions,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = SensorController;
