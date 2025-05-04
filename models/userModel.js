const bcrypt = require('bcryptjs');
const db = require('../config/pg'); // Ensure this path is correct and the db module is properly configured

const User = {
  // Fetch all users
  getAll: async () => {
    const query = 'SELECT user_id, username, email, role, created_at FROM users';
    console.log('[DEBUG] Executing getAll query:', query);
    const result = await db.query(query);
    return result.rows; // Access the rows property
  },

  // Fetch a user by ID
  findById: async (userId) => {
    if (!userId) {
      throw new Error('Invalid userId');
    }
    const query = 'SELECT user_id, username, email, role, created_at FROM users WHERE user_id = $1';
    const values = [userId];
    console.log('[DEBUG] Executing findById query:', query, 'with values:', values);
    const result = await db.query(query, values);
    return result.rows[0]; // Access the first row
  },

  // Fetch a user by email
  findByEmail: async (email) => {
    if (!email) {
      throw new Error('Invalid email');
    }
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    console.log('[DEBUG] Executing findByEmail query:', query, 'with values:', values);
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
    console.log('[DEBUG] Executing findActivationStatusByEmail query:', query, 'with values:', values);
    const result = await db.query(query, values);
    return result.rows[0]; // Access the first row
  },

  // Create a new user with a confirmation token
  create: async (username, email, password, role, confirmationToken) => {
    if (!username || !email || !password || !role || !confirmationToken) {
      throw new Error('Missing required fields');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const query = `
      INSERT INTO users (username, email, password_hash, role, confirmation_token, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id
    `;
    const values = [username, email, hashedPassword, role, confirmationToken, false];
    console.log('[DEBUG] Executing create query:', query, 'with values:', values);
    const result = await db.query(query, values);
    return result.rows[0].user_id; // Access the user_id from the first row
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
    console.log('[DEBUG] Executing updateRole query:', query, 'with values:', values);
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
    console.log('[DEBUG] Executing delete query:', query, 'with values:', values);
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
    console.log('[DEBUG] Executing findByToken query:', query, 'with values:', values);
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
    console.log('[DEBUG] Executing activateAccount query:', query, 'with values:', values);
    const result = await db.query(query, values);
    return result.rowCount > 0; // Return true if the update was successful
  }
};

module.exports = User;