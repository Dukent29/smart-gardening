const Plant = require('../models/plantModel');
const axios = require('axios');
const fs = require('fs');
const notificationController = require('./notificationController'); // Assuming you have a notification controller for sending notifications

const PlantController = {
    createPlant: async (req, res) => {
        try {
            const { name, type, description } = req.body; // Extract fields from the request body
            const user_id = req.user.userId; // Extract user_id from the authenticated user (JWT)

            // Handle the image (file or URL)
            let imageUrl = null;
            if (req.file) {
                // If a file is uploaded, store its path
                imageUrl = `/uploads/${req.file.filename}`;
            } else if (req.body.imageUrl) {
                const fullUrl = req.body.imageUrl;
                const uploadIndex = fullUrl.indexOf('/uploads/');
                if (uploadIndex !== -1) {
                    imageUrl = fullUrl.substring(uploadIndex);
                } else {
                    imageUrl = fullUrl; // Use the full URL if it doesn't contain '/uploads/'
                }

            }

            // Validate required fields
            if (!name || !type || !description || !user_id) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            const plant = await Plant.create(name, type, description, user_id, imageUrl);
            await notificationController.createNotification({
                user_id,
                type: 'plant',
                title: 'New Plant Added',
                message: `You have successfully added a new plant: ${name}.`,
            });
            console.log('Notification créée')
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
            const plant = await Plant.getById(plant_id, user_id, req);
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
            const plant = await Plant.getById(plant_id, user_id, req);
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
    },
    identifyPlant: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send({ success: false, error: 'No file uploaded' });
            }

            const base64Image = fs.readFileSync(req.file.path, 'base64');
            console.log('[DEBUG] File path:', req.file?.path);
            console.log('[DEBUG] Reading file and encoding to base64...');


            const response = await axios.post('https://api.plant.id/v2/identify', {
                images: [base64Image],
                modifiers: ["similar_images"],
                plant_details: ["common_names", "taxonomy", "wiki_description"]
            }, {
                headers: {
                    "Api-Key": process.env.PLANT_ID_API_KEY
                }
            });

            const s = response.data.suggestions?.[0] || {};
            const name = s.plant_name || 'Unknown';
            const taxonomy = s.plant_details?.taxonomy || {};
            const type = taxonomy.class || 'Unknown';
            const description = s.plant_details?.wiki_description?.value || 'No description';

            const image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

            res.send({
                success: true,
                name,
                type,
                description,
                image_url
            });
            console.log('[DEBUG] Plant ID API response:', response.data);

        } catch (err) {
            console.error('[ERROR] Identify plant:', err.message);
            res.status(500).send({ success: false, error: 'Error identifying plant' });
        }
    },
    analyzePlantHealth: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, error: 'No file uploaded' });
            }

            const base64Image = fs.readFileSync(req.file.path, 'base64');

            const response = await axios.post('https://api.plant.id/v2/health_assessment', {
                images: [base64Image],
                similar_images: true,
                desease_details: true
            }, {
                headers: {
                    "Api-Key": process.env.PLANT_ID_API_KEY
                }
            });

            res.status(200).json({
                success: true,
                health_data: response.data
            });

        } catch (error) {
            console.error('[ERROR] Analyze plant health:', error.message);
            res.status(500).json({ success: false, error: 'Error assessing plant health' });
        }
    }

};

module.exports = PlantController;