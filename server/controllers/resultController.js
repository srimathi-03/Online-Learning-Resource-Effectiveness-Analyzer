const User = require('../models/User');

exports.updateProgress = async (req, res) => {
    try {
        const { userId, courseId, preTestScore, postTestScore, status } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const progressIndex = user.progress.findIndex(p => p.courseId === courseId);

        if (progressIndex > -1) {
            const currentProgress = user.progress[progressIndex];

            if (preTestScore !== undefined) {
                currentProgress.preTestScore = preTestScore;

                // Check threshold for intermediate users (70%)
                if (currentProgress.knowledgeLevel === 'intermediate') {
                    const threshold = 70;
                    currentProgress.preTestPassed = preTestScore >= threshold;
                    currentProgress.allowedContentLevel = preTestScore >= threshold ? 'advanced' : 'basic';
                    currentProgress.status = 'In Progress';
                }
            }

            if (postTestScore !== undefined) currentProgress.postTestScore = postTestScore;
            if (req.body.topicScores) currentProgress.topicScores = req.body.topicScores;
            if (status) currentProgress.status = status;
            currentProgress.lastAccessed = Date.now();
        } else {
            user.progress.push({
                courseId,
                status: status || 'In Progress',
                preTestScore,
                postTestScore,
                topicScores: req.body.topicScores || {}
            });
        }

        user.isNewUser = false;
        await user.save();
        res.json({ message: 'Progress updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUserProgress = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.progress);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
exports.getAllUsersProgress = async (req, res) => {
    try {
        const users = await User.find({}, 'fullName email progress');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getSystemAnalytics = async (req, res) => {
    try {
        const users = await User.find({}, 'progress role');

        // 1. Total Learners (Users with role 'learner' or who have progress)
        // We'll count anyone with >0 progress records as an 'active learner' for this metric
        // OR just count all users with role 'learner'. Let's do active learners for "Overview".
        const allProgress = users.flatMap(u => u.progress);
        const uniqueLearners = new Set(allProgress.map(p => p.courseId.toString())).size; // This counts courses started, not users. 
        // comprehensive logic:
        const totalLearners = users.filter(u => u.role === 'learner').length;

        // 2. Total Tests Taken (Pre + Post)
        let totalTests = 0;
        let totalImprovement = 0;
        let improvementCount = 0;

        allProgress.forEach(p => {
            if (p.preTestScore !== undefined) totalTests++;
            if (p.postTestScore !== undefined) {
                totalTests++;

                // 3. Average Improvement
                if (p.preTestScore !== undefined) {
                    const diff = p.postTestScore - p.preTestScore;
                    if (diff > 0) { // Only count positive improvement for the "Avg Improvement" stat? 
                        // Usually avg improvement includes negative, but dashboard implies "Improvement". 
                        // Let's keep it simple: Post - Pre.
                        totalImprovement += diff;
                        improvementCount++;
                    }
                }
            }
        });

        const avgImprovement = improvementCount > 0 ? Math.round((totalImprovement / improvementCount) * 100) / 100 : 0;

        // 4. Resources (This needs Course model, but we can do it in a separate call or aggregate here if we import Course)
        // For now, AdminDashboard fetches courses separately to count resources, so we just return user-based stats here.

        res.json({
            totalLearners,
            totalTests,
            avgImprovement
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
