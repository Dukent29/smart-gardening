// jest.setup.js
const mongoose = require('mongoose');
const pool = require('./config/pg');

afterAll(async () => {
    // ✅ Close MongoDB connection
    await mongoose.connection.close();

    // ✅ Close PostgreSQL pool
    await pool.end();

    // ✅ Optional: add timeouts if needed
    console.log('✅ All DB connections closed after tests.');
});
