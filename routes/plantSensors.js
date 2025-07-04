const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const plantSensorsController = require('../controllers/plantSensorsController');

router.get('/plants-with-sensors', authenticateJWT, plantSensorsController.getPlantsWithSensors);
router.get('/:plant_id/with-sensors', authenticateJWT, plantSensorsController.getPlantWithSensors);

module.exports = router;