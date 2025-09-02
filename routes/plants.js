const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const { authenticateJWT } = require('../middleware/auth');
const Plant = require('../models/plantModel'); // Import the Plant model
const upload = require('../config/multer'); // Import the multer configuration

// Middleware to ensure the user is authenticated
router.use(authenticateJWT);

// Create a new plant with file upload
router.post('/add-plant', upload.single('image'), plantController.createPlant);
router.get('/all', plantController.getAllPlants);
router.get('/count', authenticateJWT, plantController.getPlantCountByUser);
router.get('/:plant_id', plantController.getPlantById);// Get a single plant by ID
router.delete('/:plant_id', plantController.deletePlant); // Delete a plant by ID
router.put('/:plant_id', upload.single('image'), plantController.editPlant); // Update a plant by ID
router.patch('/:plant_id/automation', authenticateJWT, async (req, res) => {
    const user_id = req.user.userId;
    const plant_id = parseInt(req.params.plant_id);
    const { is_automatic } = req.body;

    if (typeof is_automatic !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'Field "is_automatic" must be true or false.'
        });
    }

    try {
        const plant = await Plant.getById(plant_id, user_id, req);
        if (!plant) {
            return res.status(403).json({
                success: false,
                message: 'Plant not found or not authorized.'
            });
        }

        await Plant.updateAutomation(plant_id, is_automatic);

        res.status(200).json({
            success: true,
            message: `Plant automation set to ${is_automatic ? 'ON' : 'OFF'}.`
        });
    } catch (error) {
        console.error('[PATCH /automation] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});
router.post('/identify', upload.single('image'), plantController.identifyPlant);
router.post('/health', upload.single('image'), plantController.analyzePlantHealth);
module.exports = router;