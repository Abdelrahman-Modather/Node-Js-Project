const Book = require('../models/Book');
const User = require('../models/User');

const addBook = async (req, res) => {
    try {
        const { title, author, genre, price, description } = req.body;
        const newBook = await Book.create({
            title,
            author,
            genre,
            price,
            description
        });
        res.status(201).json({
            success: true,
            Book: newBook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            success: true,
            books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const getBook = async (req, res) => {
    try {
        const book = await book.findById(req.params.id);
        if(!book){
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const updateBook = async (req, res) => {
    try {
        const { title, author, genre, price, description } = req.body;
        const book = await Book.findByIdAndUpdate(req.params.id, {
            title,
            author,
            genre,
            price,
            description
        }, { new: true });
        if(!book){
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if(!book){
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

const buyBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const user = await User.findById(req.user.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        if (book.isOccupied) {
            return res.status(400).json({
                success: false,
                error: 'Book is already owned by someone else'
            });
        }

        if (user.books.includes(book._id)) {
            return res.status(400).json({
                success: false,
                error: 'You already own this book'
            });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                isOccupied: true,
                ownedBy: req.user.id
            },
            { new: true }
        );

        await User.findByIdAndUpdate(
            req.user.id,
            {
                $push: { books: book._id }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Book purchased successfully',
            book: updatedBook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const buyMultipleBooks = async (req, res) => {
    try {
        const { bookIds } = req.body;
        const user = await User.findById(req.user.id);
        const results = [];

        for (const bookId of bookIds) {
            const book = await Book.findById(bookId);
            
            if (!book) {
                results.push({
                    bookId,
                    success: false,
                    error: 'Book not found'
                });
                continue;
            }

            if (book.isOccupied) {
                results.push({
                    bookId,
                    success: false,
                    error: 'Book is already owned'
                });
                continue;
            }

            if (user.books.includes(book._id)) {
                results.push({
                    bookId,
                    success: false,
                    error: 'You already own this book'
                });
                continue;
            }

            await Book.findByIdAndUpdate(bookId, {
                isOccupied: true,
                ownedBy: req.user.id
            });

            await User.findByIdAndUpdate(
                req.user.id,
                {
                    $push: { books: bookId }
                }
            );

            results.push({
                bookId,
                success: true,
                message: 'Book purchased successfully'
            });
        }

        res.status(200).json({
            success: true,
            results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


module.exports = {
    addBook,
    getAllBooks,
    getBook,
    updateBook,
    deleteBook,
    buyMultipleBooks,
    buyBook
}