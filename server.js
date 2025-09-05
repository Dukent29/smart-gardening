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
const allowed = process.env.CORS_ORIGIN?.split(',') || ['*'];
app.use(cors({
    origin: '*',
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/users', require('./routes/users'));
app.use('/plants', require('./routes/plants'));
app.use('/sensors', require('./routes/sensors'));
app.use('/actions', require('./routes/actions'));
app.use('/mock', require('./routes/mock'));
app.use('/articles', require('./routes/articles'));
app.use('/simulate', require('./routes/simulateEffect'));
app.use('/simulation', require('./routes/simulation'));
app.use('/plantSensors', require('./routes/plantSensors'));
app.use('/notifications', require('./routes/notifications'));
// Health Check
app.get('/', (req, res) => {
    res.send('Smart Gardening Backend is running!');
});


connectMongoDB();

// simulateLoop();

module.exports = app; 
