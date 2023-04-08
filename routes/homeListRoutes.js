const express = require('express');
const homeListController = require('../controllers/homeListControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.get('/lessonvideo', homeListController.getLessonVideo);
router.get('/practiceppdt', homeListController.getPracticePpdt);
router.get('/picture-story', homeListController.getPictureStory);
router.get('/textcontent', homeListController.getTextContent);
router.get('/iqlist', homeListController.getIqList);
router.get('/verbal/:id/exam',checkAuthenticated, homeListController.getVerbalIqExam);
router.post('/verbal/:id/result',checkAuthenticated, homeListController.postVerbalIqExamResult);
router.get('/verbal/:id',checkAuthenticated, homeListController.postDoubt);



module.exports = router;
