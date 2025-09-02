// config/mongo.js
const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_garden';
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectMongoDB;
