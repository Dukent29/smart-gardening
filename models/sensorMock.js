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

function generateMockSensors(plant_id) {
    const timestamp = new Date();
    return sensorTypes.map(type => {
        const value = generateRandomValue(thresholds[type].low - 5, thresholds[type].high + 5);
        const status = getStatus(type, value);
        return {
            plant_id,
            sensor_type: type,
            value,
            status,
            timestamp
        };
    });
}

module.exports = {
    generateMockSensors
};
