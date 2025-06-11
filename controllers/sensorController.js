const Plant = require('../models/plantModel');
const Sensor = require('../models/sensorModel');
const Action = require('../models/actionModel');

const thresholds = {
    temperature: { low: 18, high: 30 },
    humidity: { low: 40, high: 70 },
    soil_moisture: { low: 25, high: 60 },
    light: { low: 200, high: 800 }
};

function getStatus(type, value) {
    const t = thresholds[type];
    if (!t) return 'OK';
    if (value < t.low) return 'LOW';
    if (value > t.high) return 'CRITICAL';
    return 'OK';
}

// la fonction d’action
function getActionText(sensor_type, status, value) {
    if (sensor_type === 'soil_moisture') {
        if (status === 'LOW') return `💧 Auto-watering triggered: soil moisture is LOW (${value}%)`;
        if (status === 'CRITICAL') return `🚨 CRITICAL soil moisture (${value}%) – Watering + Alert sent`;
    }

    if (sensor_type === 'humidity') {
        if (status === 'LOW') return `💨 Activated air humidifier: humidity is LOW (${value}%)`;
        if (status === 'CRITICAL') return `🚨 Humidity CRITICALLY LOW (${value}%) – Alert sent to user`;
    }

    if (sensor_type === 'light') {
        if (status === 'LOW') return `💡 Grow light activated: light level LOW (${value} lux)`;
        if (status === 'CRITICAL') return `🚨 Light level CRITICAL (${value} lux) – Lighting + Alert`;
    }

    if (sensor_type === 'temperature') {
        if (status === 'LOW') return `🔥 Heating system triggered: temperature LOW (${value}°C)`;
        if (status === 'CRITICAL') return `🚨 Temperature CRITICAL (${value}°C) – Extreme condition`;
    }

    return ` Sensor ${sensor_type} is ${status} (${value})`;
}

const SensorController = {
    simulateAndAutomate: async (req, res) => {
        const user_id = req.user.userId;
        const plant_id = parseInt(req.params.plant_id);

        try {
            const plant = await Plant.getById(plant_id, user_id);
            if (!plant) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: Plant not found or not yours.'
                });
            }

            const sensorTypes = await Sensor
                .find({ plant_id })
                .distinct('sensor_type');

            const triggeredActions = [];
            const processedSensors = [];

            for (const type of sensorTypes) {
                const sensor = await Sensor
                    .findOne({ plant_id, sensor_type: type })
                    .sort({ timestamp: -1 });

                if (!sensor) continue;

                console.log(`[DEBUG] Type: ${type} | Value: ${sensor.value} | Timestamp: ${sensor.timestamp}`);

                const status = getStatus(type, sensor.value);

                processedSensors.push({
                    type,
                    value: sensor.value,
                    status
                });

                if (status !== 'OK') {
                    const actionText = getActionText(type, status, sensor.value); // ✅ on l'utilise ici

                    await Action.create({
                        plant_id,
                        sensor_type: type,
                        value: sensor.value,
                        status,
                        action: actionText,
                        action_type: 'auto',
                        timestamp: new Date()
                    });

                    triggeredActions.push(actionText);
                }
            }

            res.status(200).json({
                success: true,
                message: 'Simulation & automation complete',
                sensors: processedSensors,
                triggeredActions
            });

        } catch (error) {
            console.error('[simulate] ERROR:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = SensorController;
