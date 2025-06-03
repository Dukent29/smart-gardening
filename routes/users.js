const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');


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
// Reset password using token
//router.post('/reset-password', async (req, res) => {
    //const { token, password } = req.body;

    //if (!token || !password) {
        //return res.status(400).json({ success: false, message: 'Token and new password are required' });
  //  }

    //try {
      //  const user = await User.findByResetToken(token);

        //if (!user) {
          //  return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        //}

        //if (user.reset_token_expiry < Date.now()) {
        //    return res.status(400).json({ success: false, message: 'Token has expired' });
        //}

        //const hashedPassword = await bcrypt.hash(password, 10);

        //await User.updatePassword(user.user_id, hashedPassword);

      //  return res.json({ success: true, message: 'Password updated successfully' });
    //} catch (err) {
      //  console.error('[ERROR] Resetting password:', err);
    //    return res.status(500).json({ success: false, message: 'Server error' });
  //  }
//});
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;