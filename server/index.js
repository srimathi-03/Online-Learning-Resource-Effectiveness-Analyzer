const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('LearnMetrics API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// Serve React static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch all route - serve index.html for React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (env: ${process.env.PORT || 'default'})`);
});
