const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const { authenticateJWT } = require('../middleware/auth');
const upload = require('../config/multer'); // Import the multer configuration

// Middleware to ensure the user is authenticated
router.use(authenticateJWT);

// Create a new plant with file upload
router.post('/create', upload.single('image'), plantController.createPlant);

module.exports = router;