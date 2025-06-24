const db = require('../config/pg');

const Plant = {
    create: async (name, type, description, user_id, imageUrl) => {
        if (!name || !type || !description || !user_id) {
            throw new Error('Missing required fields');
        }

        const query = `
            INSERT INTO plants (plant_name, plant_type, image_url, description, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING plant_id
        `;
        const values = [name, type, imageUrl || null, description, user_id];
        console.log('[DEBUG] Executing create query:', query, 'with values:', values);
        const result = await db.query(query, values);
        return result.rows[0];
    },
    // get all plants
    getAllByUser: async (user_id) => {
        if (!user_id) {
            throw new Error('Invalid userId');
        }
        const query = 'SELECT * FROM plants WHERE user_id = $1';
        const values = [user_id];
        const result = await db.query(query, values);
        return result.rows;
    },
    // get single plant 
    getById: async (plant_id, user_id) => {
    if (!plant_id || !user_id) {
        throw new Error('Invalid plantId or userId');
    }

    const query = `
        SELECT plant_id, plant_name, user_id, is_automatic
        FROM plants
        WHERE plant_id = $1 AND user_id = $2
    `;
    const values = [plant_id, user_id];
    const result = await db.query(query, values);
    return result.rows[0];
    },

    updateAutomation: async (plant_id, is_automatic) => {
    const query = 'UPDATE plants SET is_automatic = $1 WHERE plant_id = $2';
    const values = [is_automatic, plant_id];
    await db.query(query, values);
    },

    delete: async (plant_id, user_id) => {
        if (!plant_id || !user_id) {
            throw new Error('Invalid plantId or userId');
        }
        const query = 'DELETE FROM plants WHERE plant_id = $1 AND user_id = $2';
        const values = [plant_id, user_id];
        await db.query(query, values);
    },
    update: async (plant_id, user_id, name, type, description, imageUrl) => {
        if (!plant_id || !user_id || !name || !type || !description) {
            throw new Error('Missing required fields');
        }

        const query = `
            UPDATE plants
            SET plant_name = $1, plant_type = $2, description = $3, image_url = $4
            WHERE plant_id = $5 AND user_id = $6
            RETURNING *
        `;
        const values = [name, type, description, imageUrl, plant_id, user_id];
        console.log('[DEBUG] Executing update query:', query, 'with values:', values);

        const result = await db.query(query, values);
        return result.rowCount > 0; // Return true if a row was updated
    },
};

module.exports = Plant;
