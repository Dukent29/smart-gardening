const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const { authenticateJWT } = require('../middleware/auth');
const upload = require('../config/multer'); // Import the multer configuration

// Middleware to ensure the user is authenticated
router.use(authenticateJWT);

// Create a new plant with file upload
router.post('/add-plant', upload.single('image'), plantController.createPlant);
router.get('/all', plantController.getAllPlants); // Get all plants for the authenticated user
router.get('/:plant_id', plantController.getPlantById); // Get a single plant by ID
router.delete('/:plant_id', plantController.deletePlant); // Delete a plant by ID
router.put('/:plant_id', upload.single('image'), plantController.editPlant); // Update a plant by ID
module.exports = router;