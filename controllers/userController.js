const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, role = 'gardener' } = req.body; // Default role to 'gardener'

    // Check if the user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Generate a confirmation token
    const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Create the new user
    const newUser = await User.create(username, email, password, role, confirmationToken);

    // Send confirmation email
    const confirmationUrl = `http://localhost:5000/api/users/confirm/${confirmationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirm Your Email',
      html: `<p>Please confirm your email by clicking <a href="${confirmationUrl}">here</a>.</p>`,
    });

    res.status(201).json({ success: true, message: 'User registered. Please check your email to confirm your account.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm email
const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params; // Use req.params to get the token
    console.log('[DEBUG] Received token:', token);

    const user = await User.findByToken(token);
    if (!user) {
      console.log('[DEBUG] Invalid or expired token:', token);
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const isActivated = await User.activateAccount(user.user_id);
    if (!isActivated) {
      console.log('[DEBUG] Failed to activate account for user_id:', user.user_id);
      return res.status(500).json({ success: false, message: 'Failed to activate account' });
    }

    console.log('[DEBUG] Account activated for user_id:', user.user_id);
    res.status(200).json({ success: true, message: 'Email confirmed. You can now log in.' });
  } catch (error) {
    console.error('[ERROR] Confirm email error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if the user's email is confirmed
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Please confirm your email before logging in.' });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user_id = req.user?.userId;// Vérifiez si user_id est défini

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'Invalid user_id' });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const updatedUser = await User.update(user_id, { username, email });
    res.status(200).json({ success: true, message: 'Profil mis à jour avec succès', user: updatedUser });
  } catch (error) {
    console.error('[ERROR] Erreur lors de la mise à jour du profil :', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  confirmEmail,
  login,
  updateProfile
};