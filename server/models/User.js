const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['learner', 'admin'], default: 'learner' },
    isNewUser: { type: Boolean, default: true },
    progress: [{
        courseId: { type: String },
        knowledgeLevel: { type: String, enum: ['basic', 'intermediate'] },
        status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Pre-Test Required'], default: 'Not Started' },
        preTestScore: { type: Number },
        postTestScore: { type: Number },
        preTestPassed: { type: Boolean, default: false },
        allowedContentLevel: { type: String, enum: ['basic', 'intermediate', 'advanced'], default: 'basic' },
        topicScores: { type: Map, of: Object }, // Structure: { "JavaScript": { pre: 20, post: 80 }, ... }
        lastAccessed: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
