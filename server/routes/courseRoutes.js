const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseDetail);
router.post('/', courseController.createCourse);
router.delete('/:id', courseController.deleteCourse);

router.post('/:id/materials', courseController.addMaterial);
router.post('/:id/questions', courseController.addQuestion);

// New routes for knowledge level system
router.post('/:id/select-level', courseController.selectKnowledgeLevel);
router.get('/:id/materials-by-level', courseController.getMaterialsByLevel);

module.exports = router;
