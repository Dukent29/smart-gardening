const express = require('express');
const router = express.Router();
const Action = require('../models/actionModel');

//  test insertion action
router.get('/test', async (req, res) => {
    try {
        const test = new Action({
            plant_id: 42,
            action: 'Auto-watering triggered due to dry soil',
            action_type: 'auto',
            sensor_type: 'soil_moisture',
            value: 27.5
        });

        await test.save();
        res.json({ success: true, message: 'Action saved in MongoDB' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error saving action' });
    }
});

module.exports = router;
