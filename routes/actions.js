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
// get latest actions for a plant
router.get('/:plant_id/latest', async (req, res) => {
    const plant_id = parseInt(req.params.plant_id);

    try {
        const actions = await Action.find({ plant_id })
            .sort({ timestamp: -1 })
            .limit(10);

        if (!actions || actions.length === 0) {
            return res.status(404).json({ success: false, message: 'No actions found for this plant' });
        }

        res.status(200).json({
            success: true,
            message: 'Latest actions retrieved successfully',
            actions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
