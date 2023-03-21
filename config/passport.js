const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { User, Otp } = require('../models/userModel');

passport.use(
  new LocalStrategy({ usernameField: 'phone', passwordField: 'otp' }, async (phone, otp, done) => {
    const otpData = await Otp.findOne({ phone: phone }).sort({"expires": 1});
    if (!otpData) {
      // If no OTP data found for the user's phone number, return a custom error message to indicate authentication failure
      return done(null, false, { message: 'নতুন করে OTP পাঠান' });
    }

    if (otpData.otp !== otp) {
      // If the OTP entered by the user does not match the saved OTP, return a custom error message to indicate authentication failure
      return done(null, false, { message: 'আপনার OTP টি সঠিক নয়!' });
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
  })
);




    // passport.use(new GoogleStrategy({
    //   clientID: "69029879313-3fqsa0mb61nv1n93k41cr89h0mko7fkp.apps.googleusercontent.com", // Your Credentials here.
    //   clientSecret: "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", // Your Credentials here.
    //   callbackURL: "http://localhost:3000/auth/google/callback",
  
    // },
    // function(accessToken, refreshToken, profile, done) {
    //   console.log('hello world')
    //   console.log('hello world')
    //   User.findOne({ googleId: profile.id }, (err, user) => {
    //     if (err) return done(err, null);
    //     if (!user) {
    //       let newUser = new User({
    //         googleId: profile.id,
    //         name: profile.displayName,
    //         phone: " ",
    //       });
    //       newUser.save();
    //       return done(null, newUser);
    //     } else {
    //       // if we find an user just return return user
    //       return done(null, user);
    //     }
    //   })

    // }));

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });

