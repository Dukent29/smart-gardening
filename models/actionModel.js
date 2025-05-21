const db = require('../config/pg');

const PlantAction = {
    getByPlantId: async(plant_id) => {
            const query ='SELECT * FROM actions WHERE plant_id = $1 ORDER BY timestamp DESC';
            const results = await db.query(query, [plant_id]);
            return results.rows;
        },
create: async ({ plant_id, action, action_type, timestamp }) => {
    const result = await db.query(
        'INSERT INTO actions (plant_id, action_description, action_type, timestamp) VALUES ($1, $2, $3, $4)',
        [plant_id, action, action_type, timestamp]
    );
    return result;
},

    };


    module.exports = PlantAction;