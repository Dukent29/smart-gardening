// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema  = new mongoose.Schema({
    user_id: { type: Number, required: true }, // Assure-toi que c'est l'ID de PostgreSQL
    type: { type: String, default: 'info' },
    title: { type: String, required: true },
    message: { type: String, required: true }, // Correction ici
    is_read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);