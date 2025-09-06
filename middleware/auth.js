const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Accès refusé. Aucun jeton fourni' });
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        

        next();
    } catch (error) {
        
        res.status(401).json({ success: false, message: 'Jeton invalide' });
    }
};
