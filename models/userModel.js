const bcrypt = require('bcryptjs');
const db = require('../config/pg');
const crypto = require('crypto');



const User = {
  // Fetch all users
  getAll: async () => {
    const query = 'SELECT user_id, username, email, role, created_at FROM users';

    const result = await db.query(query);
    return result.rows; // Access the rows property
  },
  setResetToken: async (email, token, expiry) => {
    const query = `
    UPDATE users
    SET reset_token = $1, reset_token_expiry = $2
    WHERE email = $3
  `;
    const values = [token, expiry, email];

    const result = await db.query(query, values);
    return result.rowCount > 0;
  },
  // Find user by reset token
  findByResetToken: async (token) => {
    const query = `SELECT * FROM users WHERE reset_token = $1`;
    const values = [token];
    const result = await db.query(query, values);
    return result.rows[0];
  },

// Update password and clear reset fields
  updatePasswordByEmail: async (email, hashedPassword) => {
    const query = `
      UPDATE users
      SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL
      WHERE email = $2
    `;
    const values = [hashedPassword, email];
    await db.query(query, values);
  },


  clearResetToken: async (email) => {
    const query = `
    UPDATE users
    SET reset_token = NULL, reset_token_expiry = NULL
    WHERE email = $1
  `;
    await db.query(query, [email]);
  },


  // Fetch a user by ID
  findById: async (userId) => {
    if (!userId) {
      throw new Error('Invalid userId');
    }
    const query = 'SELECT user_id, username, email, role, created_at FROM users WHERE user_id = $1';
    const values = [userId];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Fetch a user by email
  findByEmail: async (email) => {
    if (!email) {
      throw new Error('Invalid email');
    }
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];

    const result = await db.query(query, values);
    return result.rows[0]; // Access the first row
  },

  // Fetch user activation status by email
  findActivationStatusByEmail: async (email) => {
    if (!email) {
      throw new Error('Invalid email');
    }
    const query = 'SELECT user_id, username, email, is_active FROM users WHERE email = $1';
    const values = [email];
    const result = await db.query(query, values);
    return result.rows[0]; // Access the first row
  },

  // Create a new user with a confirmation token
  create: async (username, email, password, role, confirmationToken) => {
    if (!username || !email || !password || !role || !confirmationToken) {
      throw new Error('Missing required fields');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash du mot de passe
    const query = `
    INSERT INTO users (username, email, password_hash, role, confirmation_token, is_active)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING user_id
  `;
    const values = [username, email, hashedPassword, role, confirmationToken, false];

    const result = await db.query(query, values); // Exécute la requête
    return result.rows[0].user_id; // Retourne l'ID de l'utilisateur
  },

  // Update a user's role
  updateRole: async (userId, newRole) => {
    if (!userId || !newRole) {
      throw new Error('Invalid userId or newRole');
    }
    const query = `
      UPDATE users
      SET role = $1
      WHERE user_id = $2
    `;
    const values = [newRole, userId];

    const result = await db.query(query, values);
    return result.rowCount > 0; // Return true if the update was successful
  },

  // Delete a user by ID
  delete: async (userId) => {
    if (!userId) {
      throw new Error('Invalid userId');
    }
    const query = 'DELETE FROM users WHERE user_id = $1';
    const values = [userId];

    const result = await db.query(query, values);
    return result.rowCount > 0; // Return true if the deletion was successful
  },

  // Find a user by confirmation token
  findByToken: async (token) => {
    if (!token) {
      throw new Error('Invalid token');
    }
    const query = 'SELECT * FROM users WHERE confirmation_token = $1';
    const values = [token];

    const result = await db.query(query, values);
    return result.rows[0]; // Access the first row
  },

  // Activate the user's account
  activateAccount: async (userId) => {
    if (!userId) {
      throw new Error('Invalid userId');
    }
    const query = `
      UPDATE users
      SET is_active = $1, confirmation_token = NULL
      WHERE user_id = $2
    `;
    const values = [true, userId];

    const result = await db.query(query, values);
    return result.rowCount > 0; // Return true if the update was successful
  },
    // Update user profile
  update: async (userId, { username, email }) => {
    const query = `
    UPDATE users
    SET 
      username = COALESCE($1, username),
      email = COALESCE($2, email),
      updated_at = NOW()
    WHERE user_id = $3
    RETURNING user_id, username, email, role, created_at
  `;
    const values = [username || null, email || null, userId];


    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Update failed');
    }

    return result.rows[0];
  },
    // Forgot password - generate a reset token

};


module.exports = User;