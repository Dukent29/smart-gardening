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
            { plant_id, sensor_type: 'temperature', value: 10, status: getStatus('temperature', 10), timestamp: new Date() },
            { plant_id, sensor_type: 'humidity', value: 20, status: getStatus('humidity', 20), timestamp: new Date() },
            { plant_id, sensor_type: 'soil_moisture', value: 15, status: getStatus('soil_moisture', 15), timestamp: new Date() },
            { plant_id, sensor_type: 'light', value: 100, status: getStatus('light', 100), timestamp: new Date() }
        ];
    } else {
        return sensorTypes.map(type => {
            const t = thresholds[type];
            const value = generateRandomValue(t.low - 5, t.high + 5); // valeur un peu en dehors exprès
            return {
                plant_id,
                sensor_type: type,
                value,
                status: getStatus(type, value),
                timestamp: new Date()
            };
        });
    }
}

module.exports = {
    generateMockSensors
};
