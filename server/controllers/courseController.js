const Course = require('../models/Course');
const User = require('../models/User');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().select('title description tags duration totalQuestions');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getCourseDetail = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.addMaterial = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        course.materials.push(req.body);
        await course.save();
        res.status(201).json(course.materials);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.addQuestion = async (req, res) => {
    try {
        const { testType, question, options, correctAnswer, difficulty, topic } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const newQ = { question, options, correctAnswer, difficulty, topic };
        if (testType === 'pre') {
            course.preTestQuestions.push(newQ);
        } else {
            course.postTestQuestions.push(newQ);
        }

        course.totalQuestions = Math.max(course.preTestQuestions.length, course.postTestQuestions.length);
        await course.save();
        res.status(201).json({ message: 'Question added', course });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// New endpoint: Select knowledge level
exports.selectKnowledgeLevel = async (req, res) => {
    try {
        const { userId, knowledgeLevel } = req.body;
        const courseId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const progressIndex = user.progress.findIndex(p => p.courseId === courseId);

        // Determine allowed content level (initially same as knowledge level)
        const allowedLevel = knowledgeLevel;

        if (progressIndex > -1) {
            user.progress[progressIndex].knowledgeLevel = knowledgeLevel;
            user.progress[progressIndex].allowedContentLevel = allowedLevel;
            user.progress[progressIndex].status = knowledgeLevel === 'basic' ? 'In Progress' : 'Pre-Test Required';
        } else {
            user.progress.push({
                courseId,
                knowledgeLevel,
                allowedContentLevel: allowedLevel,
                status: knowledgeLevel === 'basic' ? 'In Progress' : 'Pre-Test Required'
            });
        }

        await user.save();
        res.json({ message: 'Knowledge level selected', progress: user.progress });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// New endpoint: Get materials by level
exports.getMaterialsByLevel = async (req, res) => {
    try {
        const { userId } = req.query;
        const courseId = req.params.id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const userProgress = user.progress.find(p => p.courseId === courseId);
        const allowedLevel = userProgress?.allowedContentLevel || 'basic';

        // Helper for level hierarchy
        const levels = ['basic', 'intermediate', 'advanced'];
        const userLevelIndex = levels.indexOf(allowedLevel);

        console.log(`[DEBUG] Fetch Materials - User Level: ${allowedLevel}, Index: ${userLevelIndex}`);

        // Filter materials: Show materials up to the allowed level
        const filteredMaterials = course.materials.filter(m => {
            if (!m.level) return true; // Show unlabelled materials
            return levels.indexOf(m.level) <= userLevelIndex;
        });

        console.log(`[DEBUG] Materials Found: ${course.materials.length}, Returning: ${filteredMaterials.length}`);

        res.json({
            materials: filteredMaterials,
            allowedLevel,
            knowledgeLevel: userProgress?.knowledgeLevel
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
