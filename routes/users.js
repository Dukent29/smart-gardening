const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const { validateRegister, validateLogin } = require("../middleware/validateUser");
//add model user so resert-password can work


// Middleware to log requests for debugging
router.use((req, res, next) => {
    next();
});

// Register a new user
router.post('/register', validateRegister, async (req, res, next) => {
    try {
        await userController.register(req, res);
    } catch (error) {
        next(error);
    }
});
// Login a user
router.post('/login', validateLogin, async (req, res, next) => {
    try {
        await userController.login(req, res);
    } catch (error) {
        next(error);
    }
});
// Confirm email using a route parameter
router.get('/confirm/:token', userController.confirmEmail);
router.put('/profile', authenticateJWT, userController.updateProfile);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/profile', authenticateJWT, userController.getUserInfo);

module.exports = router;