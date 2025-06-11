const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    plant_id: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    action_type: {
        type: String,
        enum: ['auto', 'manual'],
        required: true
    },
    sensor_type: {
        type: String,
        enum: ['temperature', 'humidity', 'light', 'soil_moisture']
    },
    value: {
        type: Number
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Action', actionSchema);
