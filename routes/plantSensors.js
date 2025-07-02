const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const plantSensorsController = require('../controllers/plantSensorsController');

router.get('/plants-with-sensors', authenticateJWT, plantSensorsController.getPlantsWithSensors);

module.exports = router;