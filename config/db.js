const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/bookstore';
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(connectionString);
        console.log(`MongoDB Connected: ${connectionString}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;