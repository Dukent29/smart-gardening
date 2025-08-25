// routes/notifications.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Récupérer les notifications d'un utilisateur
router.get('/:user_id', notificationController.list);

// Créer une notification
router.post('/', notificationController.createNotification);
//test create notification
router.post('/test', notificationController.create);

// Marquer une notification comme lue
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;