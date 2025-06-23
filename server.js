const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/users');
const plantRoutes = require('./routes/plants');
const sensorRoutes = require('./routes/sensors');
const actionRoutes = require('./routes/actions');
const mockRoutes = require('./routes/mock');
const articleRoutes = require('./routes/articles');

const connectMongoDB = require('./config/mongo');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

// Routes
app.use('/api/users', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/mock', mockRoutes);
app.use('/api/articles', articleRoutes);


connectMongoDB();
// Health check endpoint
app.get('/', (req, res) => {
    res.send('Smart Gardening Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// [ ] Build simple JSON mock for fake sensor data (until IoT connects).