const express = require('express');
const homeController = require('../controllers/homeControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.get('/', homeController.getIndex);
router.get('/doubts', homeController.getDoubts);
router.get('/results', homeController.getResults);
router.get('/profile',checkAuthenticated, homeController.getProfile);

module.exports = router;
