const PlantAction = require('../models/actionModel');

const ActionController = {
    getActionsByPlant: async (req, res) => {
        try {
            const { plant_id } = req.params;
            const actions = await PlantAction.getByPlantId(plant_id);
            res.status(200).json({ success: true, actions });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = ActionController;
