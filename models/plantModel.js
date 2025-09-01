const db = require('../config/pg');

const Plant = {
    create: async (name, type, description, user_id, imageUrl) => {
        if (!name || !type || !description || !user_id) {
            throw new Error('Missing required fields');
        }

        try {
            const query = `
                INSERT INTO plants (plant_name, plant_type, image_url, description, user_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING plant_id
            `;
            const values = [name, type, imageUrl || null, description, user_id];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating plant: ' + error.message);
        }
    },

    getAllByUser: async (user_id) => {
        if (!user_id) {
            throw new Error('Invalid userId');
        }

        try {
            const query = 'SELECT * FROM plants WHERE user_id = $1';
            const values = [user_id];
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching plants by user: ' + error.message);
        }
    },

    getAllPlants: async () => {
        try {
            const query = 'SELECT * FROM plants';
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching all plants: ' + error.message);
        }
    },

    getById: async (plant_id, user_id, req) => {
        if (!plant_id || !user_id) {
            throw new Error('Invalid plantId or userId');
        }

        const plantIdInt = parseInt(plant_id, 10);
        const userIdInt = parseInt(user_id, 10);

        if (isNaN(plantIdInt) || isNaN(userIdInt)) {
            throw new Error('plantId and userId must be valid integers');
        }

        try {
            const query = `
                SELECT plant_id, plant_name, plant_type, user_id, is_automatic, description, image_url
                FROM plants
                WHERE plant_id = $1 AND user_id = $2
            `;
            const values = [plantIdInt, userIdInt];
            const result = await db.query(query, values);

            if (!result.rows || result.rows.length === 0) {
                throw new Error('Plant not found');
            }

            const plant = result.rows[0];

            if (plant && plant.image_url && req.protocol && req.get('host')) {
                plant.image_url = `${req.protocol}://${req.get('host')}${plant.image_url}`;
            }

            return plant;
        } catch (error) {
            throw new Error('Error fetching plant by ID: ' + error.message);
        }
    },

    getPlantCountByUser: async (user_id) => {
        if (!user_id) {
            throw new Error('Invalid userId');
        }

        try {
            const query = 'SELECT COUNT(*)::integer AS count FROM plants WHERE user_id = $1';
            const values = [user_id];
            const result = await db.query(query, values);

            if (!result.rows || result.rows.length === 0) {
                throw new Error('No result returned from the database');
            }

            const count = result.rows[0].count;

            if (isNaN(count)) {
                throw new Error('Count is not a valid number');
            }

            return count;
        } catch (error) {
            throw new Error('Error fetching plant count: ' + error.message);
        }
    },

    updateAutomation: async (plant_id, is_automatic) => {
        if (!plant_id || typeof is_automatic !== 'boolean') {
            throw new Error('Invalid plantId or is_automatic value');
        }

        try {
            const query = 'UPDATE plants SET is_automatic = $1 WHERE plant_id = $2';
            const values = [is_automatic, plant_id];
            await db.query(query, values);
        } catch (error) {
            throw new Error('Error updating automation: ' + error.message);
        }
    },

    delete: async (plant_id, user_id) => {
        if (!plant_id || !user_id) {
            throw new Error('Invalid plantId or userId');
        }

        try {
            const query = 'DELETE FROM plants WHERE plant_id = $1 AND user_id = $2';
            const values = [plant_id, user_id];
            await db.query(query, values);
        } catch (error) {
            throw new Error('Error deleting plant: ' + error.message);
        }
    },

    update: async (plant_id, user_id, name, type, description, imageUrl) => {
        if (!plant_id || !user_id || !name || !type || !description) {
            throw new Error('Missing required fields');
        }

        try {
            const query = `
                UPDATE plants
                SET plant_name = $1, plant_type = $2, description = $3, image_url = $4
                WHERE plant_id = $5 AND user_id = $6
                RETURNING *
            `;
            const values = [name, type, description, imageUrl || null, plant_id, user_id];
            const result = await db.query(query, values);
            return result.rowCount > 0; // Return true if a row was updated
        } catch (error) {
            throw new Error('Error updating plant: ' + error.message);
        }
    },
};

module.exports = Plant;