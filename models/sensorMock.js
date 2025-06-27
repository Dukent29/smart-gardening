// models/sensorMock.js
const thresholds = {
    temperature: { low: 18, high: 30 },
    humidity: { low: 40, high: 70 },
    soil_moisture: { low: 25, high: 60 },
    light: { low: 200, high: 800 }
};


const sensorTypes = ['temperature', 'humidity', 'soil_moisture', 'light'];

function generateRandomValue(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function getStatus(type, value) {
    const t = thresholds[type];
    if (!t) return 'OK';
    if (value < t.low) return 'LOW';
    if (value > t.high) return 'CRITICAL';
    return 'OK';
}

function generateMockSensors(plant_id, critical = false) {
    if (critical) {
        return [
            { plant_id, sensor_type: 'temperature', value: 10, timestamp: new Date() },      // CRITICAL
            { plant_id, sensor_type: 'humidity', value: 20, timestamp: new Date() },         // LOW
            { plant_id, sensor_type: 'soil_moisture', value: 15, timestamp: new Date() },    // LOW
            { plant_id, sensor_type: 'light', value: 100, timestamp: new Date() }            // LOW
        ];
    } else {
        return [
            { plant_id, sensor_type: 'temperature', value: parseFloat((Math.random() * 10 + 20).toFixed(1)), status: getStatus('temperature', parseFloat((Math.random() * 10 + 20).toFixed(1))) },
            { plant_id, sensor_type: 'humidity', value: parseFloat((Math.random() * 30 + 35).toFixed(1)), status: getStatus('humidity', parseFloat((Math.random() * 30 + 35).toFixed(1))) },
            { plant_id, sensor_type: 'soil_moisture', value: parseFloat((Math.random() * 40 + 20).toFixed(1)), status: getStatus('soil_moisture', parseFloat((Math.random() * 40 + 20).toFixed(1))) },
            { plant_id, sensor_type: 'light', value: Math.floor(Math.random() * 1000), status: getStatus('light', Math.floor(Math.random() * 1000)) }
        ].map(obj => ({ ...obj, timestamp: new Date() }));
    }
}


module.exports = {
    generateMockSensors
};
