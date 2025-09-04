const Sensor = require('../models/sensorModel');
const { generateMockSensors } = require('../models/sensorMock');
const Plant = require('../models/plantModel');

const INTERVAL_MS = 120 * 1000;

 // Lance une boucle pour simuler les capteurs en temps réel.

async function simulateLoop() {
    console.log('Starting sensor simulation loop...');

    setInterval(async () => {
        try {
            const result = await Plant.getAllPlants();
            const plants = result || [];

            if (plants.length === 0) {
                console.log('No plants found for user, skipping sensor simulation.');
                return;
            }

            for (const plant of plants) {
                const plant_id = plant.plant_id || plant.id;
                const newSensors = generateMockSensors(plant_id);
                await Sensor.insertMany(newSensors);
                console.log(`Simulated sensors for plant ${plant_id}:`, newSensors);
            }
        } catch (error) {
            console.error('Error occurred during loop simulation:', error);
        }
    }, INTERVAL_MS);
}

console.log('🌱 simulateLoop lancé');
module.exports = simulateLoop;