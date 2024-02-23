const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:4200"],
    })
);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/elearningdb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));


// Routes setup
app.get('/', (req, res) => {
    res.send('Welcome to the E-Learning App API');
});

// Define your routes here
app.use('/api', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
