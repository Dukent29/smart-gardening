// controllers/notificationController.js

const Notification = require('../models/Notification');

// Récupérer toutes les notifications d'un utilisateur
exports.list = async (req, res) => {
    const { user_id } = req.params;
    try {
        const notifications = await Notification.find({ user_id });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des notifications.' });
    }
};

// Créer une notification
exports.create = async (req, res) => {
    const { user_id, type, title, message } = req.body;
    try {
        const notification = new Notification({ user_id, type, title, message });
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création de la notification.' });
    }
};
exports.createNotification = async ({ user_id, type, title, message }) => {
    const notification = new Notification({ user_id, type, title, message });
    return await notification.save();
};
// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByIdAndUpdate(id, { is_read: true }, { new: true });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
};