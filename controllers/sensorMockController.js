const Sensor = require('../models/sensorModel');
const { generateMockSensors } = require('../models/sensorMock');

const sensorMockController = {
    insertMockSensors: async (req, res) => {
        const plant_id = parseInt(req.params.plant_id);

        if (isNaN(plant_id)) {
            return res.status(400).json({ success: false, message: 'Invalid plant ID' });
        }

        try {
            const sensors = generateMockSensors(plant_id);
            await Sensor.insertMany(sensors);
            res.status(200).json({ success: true, inserted: sensors });
        } catch (err) {
            console.error('[MockSensor Error]', err);
            res.status(500).json({ success: false, message: 'Error inserting mock sensors' });
        }
    }
};

module.exports = sensorMockController;
