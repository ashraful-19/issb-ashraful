
const express = require ("express");
const paymentController = require('../controllers/paymentControllers');
const app = express();
const router = express.Router();
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.get('/bkash-callback',checkAuthenticated, paymentController.postPayment);
router.get('/bkash-payment',checkAuthenticated, paymentController.getPayment);




module.exports = router;
