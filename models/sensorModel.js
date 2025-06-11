const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    plant_id: {
        type: mongoose.Schema.Types.Mixed, // ID SQL de la plante
        required: true
    },
    sensor_type: {
        type: String,
        enum: ['temperature', 'humidity', 'light', 'soil_moisture'],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sensor', sensorSchema);
