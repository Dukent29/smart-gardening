// ✅ simulateEffectController.js
const Plant = require('../models/plantModel');
const Sensor = require('../models/sensorModel');
const Action = require('../models/actionModel');
const notificationController = require('./notificationController');

const thresholds = {
    temperature: { low: 18, high: 30 },
    humidity: { low: 40, high: 70 },
    soil_moisture: { low: 25, high: 60 },
    light: { low: 200, high: 800 }
};

const simulateEffectController = {
    applyActionEffect: async (req, res) => {
        const plant_id = parseInt(req.params.plant_id);
        const user_id = req.user?.userId;

        if (isNaN(plant_id)) {
            return res.status(400).json({ success: false, message: 'Invalid plant ID' });
        }

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID is required for notifications' });
        }

        try {
            const updatedSensors = [];
            const sensors = await Sensor.find({ plant_id });

            for (const sensor of sensors) {
                let newValue = sensor.value;
                let actionNeeded = false;

                switch (sensor.sensor_type) {
                    case 'soil_moisture':
                        if (sensor.value < 25) {
                            newValue = 35;
                            actionNeeded = true;
                        }
                        break;
                    case 'humidity':
                        if (sensor.value < 40) {
                            newValue = 50;
                            actionNeeded = true;
                        }
                        break;
                    case 'light':
                        if (sensor.value < 200) {
                            newValue = 500;
                            actionNeeded = true;
                        }
                        break;
                    case 'temperature':
                        if (sensor.value < 18) {
                            newValue = 22;
                            actionNeeded = true;
                        }
                        break;
                }

                if (actionNeeded) {
                    // Construire le message de notification
                    let notificationMessage = '';
                    switch (sensor.sensor_type) {
                        case 'soil_moisture':
                            notificationMessage = 'Le niveau d\'humidité du sol est trop bas. Une irrigation manuelle est nécessaire.';
                            break;
                        case 'humidity':
                            notificationMessage = 'Le niveau d\'humidité est trop bas. Un humidificateur manuel est nécessaire.';
                            break;
                        case 'light':
                            notificationMessage = 'Le niveau de lumière est trop faible. Un éclairage manuel est nécessaire.';
                            break;
                        case 'temperature':
                            notificationMessage = 'La température est trop basse. Un chauffage manuel est nécessaire.';
                            break;
                    }

                    // Appeler le contrôleur de notification
                    await notificationController.createNotification({
                        user_id,
                        plant_id, // Ajout du champ plant_id pour plus de contexte
                        type: 'alert',
                        title: `Problème détecté avec ${sensor.sensor_type}`,
                        message: notificationMessage
                    });

                    // Mettre à jour le capteur après notification
                    sensor.value = newValue;
                    sensor.timestamp = new Date();
                    await sensor.save();

                    updatedSensors.push({
                        sensor_type: sensor.sensor_type,
                        new_value: newValue
                    });

                    let actionText = '';
                    switch (sensor.sensor_type) {
                        case 'soil_moisture':
                            actionText = '💧 Manual watering triggered';
                            break;
                        case 'humidity':
                            actionText = '💨 Manual humidifier activated';
                            break;
                        case 'light':
                            actionText = '💡 Manual lighting activated';
                            break;
                        case 'temperature':
                            actionText = '🔥 Manual heating triggered';
                            break;
                        default:
                            actionText = `Manual action on ${sensor.sensor_type}`;
                    }

                    await Action.create({
                        plant_id,
                        sensor_type: sensor.sensor_type,
                        value: newValue,
                        status: 'manual',
                        action: actionText,
                        action_type: 'manual',
                        timestamp: new Date()
                    });
                }
            }

            res.status(200).json({
                success: true,
                message: 'Mock sensor values updated after action',
                updatedSensors
            });
        } catch (err) {
            console.error('[simulateEffectController Error]', err);
            res.status(500).json({ success: false, message: 'Failed to update mock sensors' });
        }
    }
};

module.exports = simulateEffectController;
// Note: This controller is designed to simulate the effect of manual actions on sensor values.
// It updates the sensor values based on predefined thresholds and logs the actions taken.