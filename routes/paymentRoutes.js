
const express = require ("express");
const paymentController = require('../controllers/paymentControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.post('/payment',checkAuthenticated, paymentController.postPayment);
router.get('/payment',checkAuthenticated, paymentController.getPayment);
router.get('/payment-success',checkAuthenticated, paymentController.getPaymentSuccess);
router.post('/callback/success', paymentController.getSuccess);
router.post('/callback/failed', paymentController.getFailed);



module.exports = router;
