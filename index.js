const connectDB = require('./config/db');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
