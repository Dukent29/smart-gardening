require ('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connectes to PostgreSql', res.rows[0]);
        
    } catch (err) {
        console.error('Error connecting to PostgreSQL', err);
    }
}

testConnection();
module.exports = pool;