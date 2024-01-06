const express = require('express');
const homeListController = require('../controllers/homeListControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');
const { checkPayment,checkAccess,authenticateExamAccess,authenticatePracticeAccess } = require("../middlewares/updateUser");

router.get('/practiceppdt', homeListController.getPracticePpdt);
router.get('/card_content/details', homeListController.getCardContentDetails);
router.get('/iqlist', homeListController.getIqList);
router.get('/verbal/:id/exam',checkAuthenticated,authenticateExamAccess, homeListController.getVerbalIqExam);

router.get('/verbal/:id/practice',checkAuthenticated,authenticatePracticeAccess, homeListController.getVerbalIqPractice);
router.post('/verbal/:id/result',checkAuthenticated, homeListController.postVerbalIqExamResult);
router.get('/verbal/:id',checkAuthenticated, homeListController.postDoubt);
router.get('/wat', homeListController.getIncomSen);
router.get('/practice', homeListController.getIncomSen);
router.get('/practice_list', homeListController.getIncomSenList);
module.exports = router;
