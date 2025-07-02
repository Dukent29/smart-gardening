// this file is charged to make a loop to simulate sensors and gives our real time effects
const Sensor = require('../models/sensorModel');
const {generateMockSensors} = require('../models/sensorMock');
const Plant  = require('../models/plantModel'); // to retrives plant from postgres

const INTERVAL_MS = 30 * 1000; // 10 seconds

async function simulateLoop () {
    console.log('🔄 Starting sensor simulation loop...');

    setInterval(async () => {
        try {
            //retrieve all plants
            const result = await Plant.getAllPlants();
            const plants = result || [];

            if (plants.length === 0) {
                console.log('No plants found for user, skipping sensor simulation.');
                return;
        }

        for (const plant of plants) {
            const plant_id = plant.plant_id || plant.id;

            //generer des nouvelles données de capteurs
            const newSensors = generateMockSensors(plant_id);

            //insere dans db
            await Sensor.insertMany(newSensors);

            console.log(`🌱 Simulated sensors for plant ${plant_id}:`, newSensors);
        }
    } catch (error) {
        console.error('Error occurred during loop simulation:', error);
    }
}, INTERVAL_MS);

}
console.log('🌱 simulateLoop lancé');
module.exports = simulateLoop;