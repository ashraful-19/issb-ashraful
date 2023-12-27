const express = require('express');
const adminController = require('../controllers/examControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.post('/create/:id/settings', adminController.updateSettings);
router.get('/create/:id/settings', adminController.examSettings);

router.get('/create/settings/group', adminController.examGroupSettings);

router.post('/create/settings/group', adminController.examGroupSettingsUpdate);
router.get('/create/:id/delete', adminController.deleteIq);
// vebral routes
router.get('/create/verbal', adminController.getExamList);
router.post('/create/verbal', adminController.createExam);

router.get('/create/verbal/:id/edit', adminController.getEditQuestions);
// router.post('/create/verbal/:id/edit', adminController.saveQuestion);
router.get('/create/verbal/:id/question', adminController.deleteQuestion);
router.post('/create/verbal/:id/update', adminController.saveOrUpdateQuestion);

router.post('/create/verbal/:id/sort',adminController.orderQuestions);









module.exports = router;