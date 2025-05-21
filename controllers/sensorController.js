// sensorController.js
const SensorData = require('../models/sensorModel');

const SensorController = {
    getSensorDataByPlant: async (req, res) => {
        try {
            const { plant_id } = req.params;
            const data = await SensorData.getByPlantId(plant_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = SensorController;
