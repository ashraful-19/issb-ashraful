const express = require('express');
const authController = require('../controllers/authControllers');
const app = express();
const passport = require('passport');
require('../config/passport');
const router = express.Router();
const { upload } = require("../middlewares/multer");
const { updateUser } = require("../middlewares/updateUser");
const { checkAuthenticated, checkLoggedIn } = require('../config/auth');

router.get('/sendotp', authController.getSendOtp);
router.get('/loginNaow lagtepare', authController.getRegister);
router.get('/login',checkLoggedIn, authController.getLogin);
router.post('/login',
passport.authenticate('local', { failureRedirect: '/login-failure' }),updateUser,
(req, res) => {
  console.log('Login successful!');
  res.redirect('/');
});
router.post('/sendotp', authController.postSendOtp);

router.get('/update-profile', authController.getUpdateProfile);
router.post('/update-profile', authController.postUpdateProfile);
router.post('/update-profilepic',upload.single('avatar'), authController.postUpdateProfilePic);
router.get('/logout',authController.logout);

module.exports = router;
