const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    tags: [String],
    duration: String,
    totalQuestions: Number,
    materials: [{
        type: { type: String, enum: ['video', 'doc', 'website', 'udemy', 'coursera', 'youtube', 'pdf'] },
        title: String,
        url: String,
        duration: String,
        rating: Number,
        level: { type: String, enum: ['basic', 'intermediate', 'advanced'], default: 'basic' }
    }],
    preTestQuestions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        difficulty: String,
        topic: String
    }],
    postTestQuestions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        difficulty: String,
        topic: String
    }],
    recommendations: [{
        title: String,
        provider: String,
        efficiency: String,
        description: String,
        url: String
    }]
});

module.exports = mongoose.model('Course', courseSchema);
