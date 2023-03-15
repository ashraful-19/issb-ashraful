const express = require('express');
const adminController = require('../controllers/adminControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.get('/dashboard', adminController.dashboard);







// subadmin model routes goes here

//ppdt and story routes
router.post('/editppdt',adminController.createPpdtorstory);
router.get('/editppdt',adminController.readPpdtorstory);
router.get('/editppdt/type',adminController.readPpdtorstorybytype);
router.post('/editppdt/order',adminController.orderPpdtorstory);
router.post('/updateppdt',adminController.updatePpdtorstory);
router.get('/editppdt/:id',adminController.deletePpdtorstory);

//video content routes
router.post('/videocontent',adminController.createVideoContent);
router.get('/videocontent',adminController.readVideoContent);
router.get('/videocontent/type',adminController.readVideoContentbytype);
router.post('/videocontent/order',adminController.orderVideoContent);
router.post('/updatevideocontent',adminController.updateVideoContent);
router.get('/videocontent/:id',adminController.deleteVideoContent);

//Text Content routes
router.post('/textcontent',adminController.createTextContent);
router.get('/textcontent',adminController.readTextContent);
router.get('/textcontent/type',adminController.readTextContentbytype);
router.post('/textcontent/order',adminController.orderTextContent);
router.post('/updatetextcontent',adminController.updateTextContent);
router.get('/textcontent/:id',adminController.deleteTextContent);



//Planning Content routes
router.post('/planningcontent',adminController.createPlanningContent);
router.get('/planningcontent',adminController.readPlanningContent);
// router.get('/planningcontent/type',adminController.readPlanningContentbytype);
// router.post('/planningcontent/order',adminController.orderPlanningContent);
router.post('/updateplanningcontent',adminController.updatePlanningContent);
router.get('/planningcontent/:id',adminController.deletePlanningContent);




module.exports = router;
