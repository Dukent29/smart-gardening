const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//middleware to authenticate JWT token
exports.authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No Token provided' });
    }
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user info (e.g., userId) to the request object
        next();
    }
    catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};