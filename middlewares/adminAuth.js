const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWTSECRET = "Shampoo";

const adminAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWTSECRET);

            // Get user from token
            const user = await User.findById(decoded.id);

            if (!user || !user.isAdmin) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized as admin'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                error: 'Not authorized'
            });
        }
    }

    if (!token) {
        res.status(401).json({
            success: false,
            error: 'Not authorized, no token'
        });
    }
};

module.exports = adminAuth;