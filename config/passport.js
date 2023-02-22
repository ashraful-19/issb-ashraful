const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User, Otp } = require('../models/userModel');

passport.use(
  new LocalStrategy({ usernameField: 'phone', passwordField: 'otp' },async (phone, otp, done) => {
    const otpData = await Otp.findOne({ phone: phone }).sort({"expires": 1});
     if (!otpData) {
      // If no OTP data found for the user's phone number, return false to indicate authentication failure
      return done(null, false);
    }

    if (otpData.otp !== otp) {
      // If the OTP entered by the user does not match the saved OTP, return false to indicate authentication failure
      return done(null, false);
    }

    // If OTP matches, find or create user and return the user object to indicate authentication success
    User.findOne({ phone: phone }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        const newUser = new User({ phone: phone });
        newUser.save((err, savedUser) => {
          if (err) {
            return done(err);
          }

          return done(null, savedUser);
        });
      } else {
        return done(null, user);
      }
    });
    }));

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });

