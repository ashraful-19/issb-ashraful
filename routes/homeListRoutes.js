const express = require('express');
const homeListController = require('../controllers/homeListControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.get('/lessonvideo', homeListController.getLessonVideo);
router.get('/practiceppdt', homeListController.getPracticePpdt);


module.exports = router;
