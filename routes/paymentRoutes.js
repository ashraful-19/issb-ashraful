
const express = require ("express");
const paymentController = require('../controllers/paymentControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.get('/payment',checkAuthenticated, paymentController.postPayment);
router.post('/callback/success', paymentController.getSuccess);
router.post('/callback/failed', paymentController.getFailed);



module.exports = router;
