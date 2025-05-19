const Plant = require('../models/plantModel');

const PlantController = {
    createPlant: async (req, res) => {
        try {
            const { name, type, description } = req.body; // Extract fields from the request body
            const user_id = req.user.userId; // Extract user_id from the authenticated user (JWT)

            // Handle the image (file or URL)
            let imageUrl = null;
            if (req.file) {
                // If a file is uploaded, store its path
                imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            } else if (req.body.imageUrl) {
                // If a URL is provided, use it
                imageUrl = req.body.imageUrl;
            }

            // Validate required fields
            if (!name || !type || !description || !user_id) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            const plant = await Plant.create(name, type, description, user_id, imageUrl);
            res.status(201).json({
                success: true,
                message: 'Plant created successfully',
                plant,
            });
        } catch (error) {
            console.error('[ERROR] Create plant error:', error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getAllPlants: async (req, res) => {
        try {
            const user_id = req.user.userId;
            const plants = await Plant.getAllByUser(user_id);
            res.status(200).json({ success: true, plants });
        } catch (error) {
            console.error('[ERROR] Get all plants:', error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getPlantById: async (req, res) => {
        try {
            const { plant_id } = req.params;
            const user_id = req.user.userId;
            const plant = await Plant.getById(plant_id, user_id);
            if (!plant) {
                return res.status(404).json({ success: false, message: 'Plant not found' });
            }
            res.status(200).json({ success: true, plant });
        } catch (error) {
            console.error('[ERROR] Get plant by ID:', error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },   
    deletePlant:async (req, res) => {
        try {
            const { plant_id } = req.params;
            const user_id = req.user.userId;
            const plant = await Plant.getById(plant_id, user_id);
            if (!plant) {
                return res.status(404).json({ success: false, message: 'Plant not found' });
            }
            await Plant.delete(plant_id, user_id);
            res.status(200).json({ success: true, message: 'Plant deleted successfully' });
        } catch (error) {
            console.error('[ERROR] Delete plant:', error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    } ,
    editPlant: async (req, res) => {
        try {
            const user_id = req.user.userId; // Extract user_id from the authenticated user
            const { plant_id } = req.params; // Extract plant_id from the route parameter
            const { name, type, description } = req.body; // Extract fields to update

            // Handle the image (file or existing URL)
            let imageUrl = null;
            if (req.file) {
                // If a new file is uploaded, use its path
                imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            } else {
                // If no new file is uploaded, fetch the existing image URL from the database
                const existingPlant = await Plant.getById(plant_id, user_id);
                if (!existingPlant) {
                    return res.status(404).json({ success: false, message: 'Plant not found' });
                }
                imageUrl = existingPlant.image_url; // Preserve the existing image URL
            }

            // Update the plant
            const success = await Plant.update(plant_id, user_id, name, type, description, imageUrl);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Plant not found or not authorized to update' });
            }

            res.status(200).json({ success: true, message: 'Plant updated successfully' });
        } catch (error) {
            console.error('[ERROR] Update plant:', error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = PlantController;