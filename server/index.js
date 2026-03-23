const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({
  origin: "https://online-learning-resource-effectiven-mu.vercel.app",
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('LearnMetrics API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (env: ${process.env.PORT || 'default'})`);
});
