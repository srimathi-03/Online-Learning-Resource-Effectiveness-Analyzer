const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    createdAt: { type: Date, default: Date.now },
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
    resetToken: { type: String }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
