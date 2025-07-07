const { body, validationResult } = require("express-validator");

// Middleware pour valider l’inscription
const validateRegister = [
    body("username")
        .trim()
        .notEmpty().withMessage("Le nom est requis")
        .isLength({ min: 3 }).withMessage("Minimum 3 caractères")
        .escape(),

    body("email")
        .isEmail().withMessage("Email invalide")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 }).withMessage("Mot de passe trop court (6 min)"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next(); // continue vers le controller si pas d’erreurs
    }
];

// Middleware pour valider le login
const validateLogin = [
    body("email")
        .isEmail().withMessage("Email invalide")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Mot de passe requis"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateRegister,
    validateLogin
};
