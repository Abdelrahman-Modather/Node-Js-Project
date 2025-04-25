const express = require('express');
const router = express.Router();
const { registerUser, registerAdmin ,loginUser, getUserBooks ,getUser, updateUser, deleteUser, logoutUser } = require('../controllers/userController');
const auth = require('../middlewares/auth');


router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);
router.get('/my-books', auth, getUserBooks);
router.post('/login', loginUser);
router.get('/me', auth, getUser);
router.put('/me', auth, updateUser);
router.delete('/me', auth, deleteUser);
router.post('/logout', auth, logoutUser);

module.exports = router;