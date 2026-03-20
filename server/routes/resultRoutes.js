const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

// All result routes are protected
router.post('/update', protect, resultController.updateProgress);
router.get('/all/progress', protect, resultController.getAllUsersProgress);
router.get('/analytics', protect, resultController.getSystemAnalytics);
router.get('/recommendations/:userId/:courseId', protect, resultController.getPreTestRecommendations);

// Adaptive CAT routes
router.post('/adaptive/next-question', protect, resultController.getAdaptiveNextQuestion);
router.post('/adaptive/save', protect, resultController.saveAdaptiveTestResult);

router.get('/:userId', protect, resultController.getUserProgress);

module.exports = router;
