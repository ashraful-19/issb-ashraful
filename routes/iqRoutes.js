const express = require('express');
const adminController = require('../controllers/iqControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.post('/create/:id/settings', adminController.updateSettings);
router.get('/create/:id/settings', adminController.settingsIq);
router.get('/create/:id/delete', adminController.deleteIq);
// vebral routes
router.get('/create/verbal', adminController.getCreateVerbalIq);
router.post('/create/verbal', adminController.createVerbalIq);

router.get('/create/verbal/:id/edit', adminController.getEditVerbalIq);
router.post('/create/verbal/:id/edit', adminController.saveVerbalIq);
router.get('/create/verbal/:id/question', adminController.deleteEditVerbalIq);
router.post('/create/verbal/:id/update', adminController.updateEditVerbalIq);

//nonverbal routes
router.get('/create/nonverbal', adminController.getCreateNonVerbalIq);
router.post('/create/nonverbal', adminController.createNonVerbalIq);

router.get('/create/nonverbal/:id/edit', adminController.getEditNonVerbalIq);
router.post('/create/nonverbal/:id/edit', adminController.saveNonVerbalIq);
router.get('/create/nonverbal/:id/question', adminController.deleteEditNonVerbalIq);
router.post('/create/nonverbal/:id/update', adminController.updateEditNonVerbalIq);







module.exports = router;
