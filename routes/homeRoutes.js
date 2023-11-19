const express = require('express');
const homeController = require('../controllers/homeControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');
const { checkPayment,checkAccess } = require("../middlewares/updateUser");

router.get('/terms&conditions', homeController.getTermsAndConditions);
router.get('/', homeController.getIndex);
router.get('/doubts',checkAuthenticated, homeController.getDoubts);
router.get('/course', homeController.getCourses);
router.get('/profile',checkAuthenticated, homeController.getProfile);
router.get('/course-details/:id', checkPayment ,homeController.getCourseDetails);
router.get('/dashboard',checkAuthenticated, homeController.getDashboard);
router.get('/course-lecture/:id' , checkAccess, homeController.getCourseLecture);


module.exports = router;
