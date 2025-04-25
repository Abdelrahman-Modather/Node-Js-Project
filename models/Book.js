const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        trim: true,
        maxlength: [50, 'Author cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    published: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
});

module.exports = mongoose.model('Book', bookSchema);