const db = require('../config/pg');// Adjust the path to your db module
const { get } = require('../routes/users');
const { create } = require('./userModel');

const Plant = {
    //create a new plant
    create: async (name, type, description, user_id, imageUrl) => {
        if (!name || !type || !description || !user_id) {
            throw new Error('Missing required fields');
        }
        const query = `
            INSERT INTO plants (plant_name, plant_type, image_url, description, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING plant_id
        `;
        const values = [name, type, imageUrl || null, description, user_id]; // Handle imageUrl as optional
        console.log('[DEBUG] Executing create query:', query, 'with values:', values);
        const result = await db.query(query, values);
        return result.rows[0]; // Access the first row
    },

    //get all plants for user
    getAllByUser:async (user_Id) => {
        if(!user_Id) {
            throw new Error('Invalid userId');
        }
        const query = 'SELECT * FROM plants WHERE user_id = $1';
        const values = [user_id];
        console.log('[DEBUG] Executing getAllByUser query:', query, 'with values:', values);
        const result = await db.query(query, values);
        return result.rows; // retuen all plants for user
    },

    //get single plant by id
    getById: async (plant_id, user_Id) => {
        if(!plant_id || !user_Id) {
            throw new Error('Invalid plantId or userId');
        }
        const query = 'SELECT * FROM plants WHERE plant_id = $1 AND user_id = $2';
        const values = [plant_id, user_Id];
        console.log('[DEBUG] Executing getById query:', query, 'with values:', values);
        const result = await db.query(query, values);
        return result.rows[0]; // return the plant if found
    },
};
module.exports = Plant;