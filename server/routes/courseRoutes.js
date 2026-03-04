const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (learners need to read without auth)
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseDetail);
router.get('/:id/materials-by-level', courseController.getMaterialsByLevel);

// Protected routes (require valid JWT)
router.post('/', protect, courseController.createCourse);
router.delete('/:id', protect, courseController.deleteCourse);
router.post('/:id/materials', protect, courseController.addMaterial);
router.post('/:id/questions', protect, courseController.addQuestion);
router.post('/:id/select-level', protect, courseController.selectKnowledgeLevel);

module.exports = router;
