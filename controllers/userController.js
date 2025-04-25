const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = "Shampoo";


const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            success: true,
            user
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const registerAdmin = async (req, res) => {
    try {
        const {name, email, password, adminCode} = req.body;
        
        // Check admin registration code
        if (adminCode !== 'Shampoo') {
            return res.status(401).json({
                success: false,
                error: 'Invalid admin code'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: true
        });

        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(404).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(404).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        const token = jwt.sign({id: user._id}, JWT_SECRET, {
            expiresIn: 24 * 60 * 60
        });
        res.status(200).json({
            success: true,
            token
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const getUser = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    }
        catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const getUserBooks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('books');
        res.status(200).json({
            success: true,
            books: user.books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const updateUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            password: hashedPassword
        }, {new: true});
        if(!user){
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const deleteUser = async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.user.id);
        if(!user){
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted'
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const logoutUser = async (req, res) => {
    try{
        res.status(200).json({
            success: true,
            message: 'User logged out'
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    registerUser,
    registerAdmin,
    loginUser,
    getUser,
    getUserBooks,
    updateUser,
    deleteUser,
    logoutUser
}



