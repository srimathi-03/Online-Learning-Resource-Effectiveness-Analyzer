const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

router.post('/update', resultController.updateProgress);
router.get('/all/progress', resultController.getAllUsersProgress);
router.get('/analytics', resultController.getSystemAnalytics);
router.get('/:userId', resultController.getUserProgress);

module.exports = router;
