const express = require ("express");
const axios = require('axios');
const {Otp,User} = require("../models/userModel");
require("../config/passport");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ejs = require('ejs');
const flash = require('connect-flash');

const getRegister = async (req, res) => {
  try {
    res.send('Get Login');
    
    
    } 
    catch (error) {
   
  }};

const getLogin = async (req, res) => {
    try {

      res.render('auth/login');
      
      } 
      catch (error) {
     
    }};



    // const postLogin = async (req, res) => {
    //   try {
    //     console.log('passport is working cool');
    //     const returnTo = req.session.returnTo || '/';
    //     delete req.session.returnTo;
    //     res.redirect(returnTo);
    //     // res.redirect('/success');
    //   } catch (error) {
    //     console.error(error);
    //     res.redirect('/failure');
    //   }
    // };
 
  

    const postSendOtp = async (req, res) => {
      try {
        let phoneNumber = req.body.phone;
    
        // Remove the prefix '+88' if it exists
        if (phoneNumber.startsWith("+88")) {
          phoneNumber = phoneNumber.slice(3);
        }
        if (phoneNumber.startsWith("88")) {
          phoneNumber = phoneNumber.slice(2);
        }
    
        // Validate the resulting phone number
        if (/^01[0-9]{9}$/.test(phoneNumber)) {
          console.log(`Valid phone number: ${phoneNumber}`);
        } else {
          console.log("Invalid phone number");
          // Handle invalid phone number error here
          req.flash('error', 'Invalid Phone Number');
          res.redirect('/auth/login');     
         }
    
        // // OTP GENERATOR
        // const otpCode = Math.floor(Math.random() * 9000) + 1000;
        // console.log(`Your OTP is: ${otpCode}`);
    
        // // Check if the phone number already exists in the Otp collection
        // const existingOtp = await Otp.findOne({ phone: phoneNumber });
        // if (existingOtp) {
        //   console.log("Existing OTP found. Deleting...");
        //   await Otp.deleteOne({ phone: phoneNumber });
        // }
    
        // const userotp = new Otp({
        //   phone: phoneNumber,
        //   otp: otpCode,
        // });
    
        // userotp.save()
        //   .then(() => {
        //     console.log("OTP saved to database");
        //     res.redirect('/auth/sendotp?phone=' + phoneNumber);

        //   })
        //   .catch(error => {
        //     console.error(error);
        //     // Handle database save error here
        //     res.status(500).json({ error: "Internal server error" });
        //   });
    
        // // SMS SENDING TO USER
        // const api_key = '01772512057.a712f81a-a74e-4f92-be17-3aa3616f8a1b'; // Update with your API key
        // const senderid = '8809612440728'; // Update with your Sender Id
        // const type = 'text'; // Update with your preferred type
        // const url = 'https://smsmassdata.massdata.xyz/api/sms/send';
    
        // const data = {
        //   apiKey: api_key,
        //   type,
        //   contactNumbers: 88+phoneNumber,
        //   senderId: senderid,
        //   textBody: `Your OTP from Mission Academy: ${otpCode}`,
        // };
    
        // axios.post(url, data)
        //   .then(response => {
        //     console.log('SMS sent successfully:', response.data);
        //     req.session.phone = phoneNumber;
        //     res.redirect('/auth/sendotp?phone=' + phoneNumber);
        //   })
        //   .catch(error => {
        //     console.error('Error sending SMS:', error);
        //     // Handle SMS sending error here
        //     res.status(500).json({ error: "Error sending SMS" });
        //   });
      } catch (error) {
        console.error(error);
        // Handle other errors here
        return res.status(500).json({ error: "Internal server error" });
      }
    };
    
  

const postRegister = async (req, res) => {
        try {
          res.send('hello world');
          
          } 
          catch (error) {
         
        }};

        const getUpdateProfile = async (req, res) => {
          try {
            const user = await User.findOne({ phone: req.user.phone });
            res.render('auth/update-profile',{user: user});

            
            } 
            catch (error) {
           
          }};        
    const postUpdateProfile = async (req, res) => {
            try {
              const phone = req.user.phone;
    
    // Find the user object by phone number and update the fields
    const result = await User.findOneAndUpdate(
      { phone: req.user.phone },
      { $set: {
          name: req.body.name,
          institution: req.body.institution,
          course: req.body.course,
          email: req.body.email
        }
      },
      { new: true }
    );

    if (result) {
      console.log('data updated successfully');
      res.redirect('/profile')
    } else {
      res.status(404).json({ error: 'User not found' });
    }
            } catch (error) {
              res.status(500).json({ error: error.message });
            }};        
        






      const postUpdateProfilePic = async (req, res) => {
              try {
                const result = await User.findOneAndUpdate(
                { phone: req.user.phone },
                { $set: { profile_pic: req.file.filename } },
                { new: true }
              );
              res.json({data: req.user.phone});
                
              }
                catch (error) {
               
              }};               
                  
                       
const getSendOtp = async (req, res) => {
          try {
            
            const phoneNumber = req.query.phone;
            
            res.render('auth/otp', {phoneNumber: phoneNumber});
            
            } 
            catch (error) {
           
          }};
        
    
  
  const logout = async (req, res, next) => {
    try{
      req.logout(function(err) {
        if (err) { return next(err); }
      res.redirect('/auth/login');
      });
    
      }
     catch (error) {
             console.log(error.message)
         }};
          

module.exports = {
  
  getLogin,
  getRegister,
  // postLogin,
  postRegister,
  postSendOtp,
  getSendOtp,
  getUpdateProfile,
  postUpdateProfile,
  postUpdateProfilePic,
  logout,
};




