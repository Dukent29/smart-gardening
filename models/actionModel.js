const db = require('../config/db');

const PlantAction = {
    getByPlantId: async(plant_id) => {
            db.query ='SELECT * FROM actions WHERE plant_id = $1 ORDER BY timestamp DESC';
            const results = await db.query(query, [plant_id]);
            return results.rows;
        }
    };

    module.exports = PlantAction;