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
};

module.exports = PlantController;