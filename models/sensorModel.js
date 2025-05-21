const db = require('../config/pg');

const SensorData = {
    getByPlantId: async (plant_id) => {
        const query = 'SELECT * FROM sensors WHERE plant_id = $1 ORDER BY timestamp DESC';
        const result = await db.query(query, [plant_id]);
        return result.rows;
    }
};

module.exports = SensorData;
