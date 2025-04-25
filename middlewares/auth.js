const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWTSECRET = "Shampoo";

const auth = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWTSECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized'
        });
    }
};

module.exports = auth;
