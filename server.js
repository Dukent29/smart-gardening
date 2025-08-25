// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectMongoDB = require('./config/mongo');
// const simulateLoop = require('./services/simulateLoop')

dotenv.config();

const app = express();

// Middleware
app.use(cors("*"));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/plants', require('./routes/plants'));
app.use('/api/sensors', require('./routes/sensors'));
app.use('/api/actions', require('./routes/actions'));
app.use('/api/mock', require('./routes/mock'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/simulate', require('./routes/simulateEffect'));
app.use('/api/simulation', require('./routes/simulation'));
app.use('/api', require('./routes/plantSensors'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/notifications', require('./routes/notifications'));
// Health Check
app.get('/', (req, res) => {
    res.send('Smart Gardening Backend is running!');
});

// Connect DB (tu peux aussi appeler dans index.js si tu veux + de contrôle)
connectMongoDB();

// simulateLoop();

module.exports = app; // 🔥 On exporte `app` (sans listen)
