const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No Token provided' });
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the userId and other info from token


        next();
    } catch (error) {

        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
