const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticateJWT } = require('../middleware/auth'); // Optionnel selon les routes
const upload = require('../config/multer');

//  GET — Lire tous les articles (filtrage optionnel par catégorie)
router.get('/', articleController.getAllArticles);

//  POST — Ajouter un nouvel article (auth requis)
router.post('/', authenticateJWT, upload.single('image'), articleController.createArticle);

//  DELETE — Supprimer un article par ID (auth requis)
router.delete('/:id', authenticateJWT, articleController.deleteArticle);

module.exports = router;
