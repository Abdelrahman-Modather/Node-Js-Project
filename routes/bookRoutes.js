const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBook, updateBook, deleteBook, buyBook, buyMultipleBooks } = require('../controllers/bookController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');


router.post('/add', adminAuth, addBook);
router.post('/buy/:id', auth, buyBook);
router.post('/buy-multiple', auth, buyMultipleBooks);
router.get('/', getAllBooks);
router.get('/:id', getBook);
router.put('/:id', adminAuth, updateBook);
router.delete('/:id', adminAuth, deleteBook);


module.exports = router;