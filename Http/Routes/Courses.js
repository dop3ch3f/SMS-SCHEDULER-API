const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/Courses.js');

// Routes related to Courses

// Todo: route to get  all courses
router.get("/courses", courseController.getAllCourses);

// Todo: route to get one course
router.get("/courses/:id", courseController.getSingleCourse);

// Todo: route to create course
router.post("/courses", courseController.createCourse);

// Todo: route to delete course
router.delete("/courses", courseController.deleteCourse);


// Todo: route to create module in a course
router.post("/courses/:id/modules", courseController.createModuleForCourse);

// Todo: route to delete module in a course



module.exports = router;
