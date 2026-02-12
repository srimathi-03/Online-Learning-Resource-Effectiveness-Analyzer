const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    knowledgeLevel: { type: String, enum: ['basic', 'intermediate'] },
    preTestScore: { type: Number, default: 0 },
    postTestScore: { type: Number, default: 0 },
    preTestPassed: { type: Boolean, default: false },
    allowedContentLevel: { type: String, enum: ['basic', 'advanced'], default: 'basic' },
    status: { type: String, default: 'Not Started' },
    topicScores: {
        type: Map,
        of: {
            pre: Number,
            post: Number
        },
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
