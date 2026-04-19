const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnmetrics';
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        console.error(`Full Error: ${JSON.stringify(err)}`);
        process.exit(1);
    }
};

module.exports = connectDB;
