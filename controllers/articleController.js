const Joi = require('joi');
const Article = require('../models/articleModel');
// configure notifications
const { createNotification } = require('./notificationController');
const notificationController = require("./notificationController");

// Schéma de validation pour la création d'un article
const articleSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    content: Joi.string().required(),
    category: Joi.string().required(),
    author: Joi.string().required(),
});

// Schéma de validation pour l'ID d'un article
const idSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

// get articles list by category
exports.getAllArticles = async (req, res) => {
    try {
        const { category } = req.query;

        // id category is defined, filter if not display all
        const filter = category ? { category } : {};
        const articles = await Article.find(filter).sort({ createdAt: -1 });

        res.status(200).json({ success: true, articles });
    } catch (error) {
        console.error('[GET /articles] ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// get article by id
exports.getArticleById = async (req, res) => {
    try {
        const { error } = idSchema.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: `Validation error: ${error.details[0].message}`,
            });
        }

        const { id } = req.params;
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }
        res.status(200).json({ success: true, article });
    } catch (error) {
        console.error('[GET /articles/:id] ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// create article
exports.createArticle = async (req, res) => {
    try {
        const { error } = articleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: `Validation error: ${error.details[0].message}`,
            });
        }

        const { title, content, category, author } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const article = new Article({
            title,
            content,
            category,
            author,
            image: imageUrl,
        });

        await article.save();

        // Notification globale (sans user_id)
        await notificationController.createNotification({
            type: 'info',
            title: 'Nouvel article publié',
            message: `Un nouvel article "${title}" a été publié.`,
        });

        res.status(201).json({
            success: true,
            message: 'Article créé',
            article,
        });
    } catch (error) {
        console.error('[createArticle] ERROR:', error);
        res.status(500).json({ success: false, message: 'Échec de la création de l\'article' });
    }
};

// delete article
exports.deleteArticle = async (req, res) => {
    try {
        const { error } = idSchema.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: `Validation error: ${error.details[0].message}`,
            });
        }

        const { id } = req.params;
        await Article.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Article deleted' });
    } catch (error) {
        console.error('[DELETE /articles/:id] ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};