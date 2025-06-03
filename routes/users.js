const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/auth');


// Middleware to log requests for debugging
router.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} request to ${req.originalUrl}`);
    console.log(`[DEBUG] Request Body:`, req.body);
    next();
});

// Register a new user
router.post('/register', async (req, res, next) => {
    try {
        console.log('[DEBUG] Register endpoint hit');
        await userController.register(req, res);
    } catch (error) {
        console.error('[ERROR] Register endpoint error:', error);
        next(error);
    }
});

// Login a user
router.post('/login', async (req, res, next) => {
    try {
        console.log('[DEBUG] Login endpoint hit');
        await userController.login(req, res);
    } catch (error) {
        console.error('[ERROR] Login endpoint error:', error);
        next(error);
    }
});

// Confirm email using a route parameter
router.get('/confirm/:token', userController.confirmEmail);
router.put('/profile', authenticateJWT, userController.updateProfile);

module.exports = router;