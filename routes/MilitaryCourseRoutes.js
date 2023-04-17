const express = require('express');
const MilitaryCourseController = require('../controllers/MilitaryCourseControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.get('/', MilitaryCourseController.getCourse);
router.get('/create_course', MilitaryCourseController.getCreateCourse);
router.post('/create_course', MilitaryCourseController.postCreateCourse);
router.get('/update/:id', MilitaryCourseController.getUpdateCourse);
router.post('/update/:id', MilitaryCourseController.postUpdateCourseSyllabusList);
router.get('/:id/syllabus/:syllabus_id/', MilitaryCourseController.deleteCourseSyllabusItem);
router.get('/:id/syllabus/:syllabus_id/details/:details_id', MilitaryCourseController.deleteCourseSyllabusItemDetails);
router.get('/update-syllabus/:id', MilitaryCourseController.getUpdateCourseSyllabus);
router.post('/update-syllabus/:id', MilitaryCourseController.postUpdateCourseSyllabus);
module.exports = router;
