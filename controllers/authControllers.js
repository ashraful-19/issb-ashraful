const express = require ("express");
const axios = require('axios');
const {Otp,User} = require("../models/userModel");
require("../config/passport");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

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

    const postLogin = async (req, res) => {
      try {
        console.log('passport is working cool');
        res.redirect('/success');
      } catch (error) {
        console.error(error);
        res.redirect('/failure');
      }
    };
 
  const postSendOtp = async (req, res) => {
      try {
        
            let phoneNumber = req.body.phone; // Replace this with the phone number entered by the user

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
            }
            // OTP GENERATOR
            const otpCode = Math.floor(Math.random() * 9000) + 1000;

            console.log(`Your OTP is: ${otpCode}`);

            // Check if the phone number already exists in the Otp collection
    const existingOtp = await Otp.findOne({ phone: phoneNumber });
    if (existingOtp) {
      console.log("Existing OTP found. Deleting...");
      await Otp.deleteOne({ phone: phoneNumber });
    }
            const userotp = new Otp({ 
              phone: phoneNumber,
              otp: otpCode,
             });

            userotp.save()
              .then(() => {
                console.log("OTP saved to database");
              })
              .catch(error => {
                console.error(error);
              });








            res.redirect('/auth/sendotp?phone='+ phoneNumber);




            // //SMS SENDING TO USER
            
            // const api_key = 'C200185063f13146cddc14.43129910';
            // const senderid = '8809601004771';
            // const type = 'text';
            // const scheduledDateTime = ''; // Leave empty for immediate sending
            // const msg = 'Your OTP code from ISSB: goodLuck';
            // // const contacts = phoneNumber;
            
            // const url = 'https://isms.mimsms.com/smsapi';
            
            // const data = {
            //   api_key,
            //   senderid,
            //   type,
            //   scheduledDateTime,
            //   msg,
            //   contacts
            // };
            
            // axios.post(url, data)
            //   .then(response => {
            //     console.log('SMS sent successfully:', response.data);
                
            //   })
            //   .catch(error => {
            //     console.error('Error sending SMS:', error);
            //   });
            
          
        
        } 
        catch (error) {
       
      }};

const postRegister = async (req, res) => {
        try {
          res.send('hello world');
          
          } 
          catch (error) {
         
        }};

        const getUpdateProfile = async (req, res) => {
          try {
  
            res.render('auth/update-profile');

            
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
               
                if(req.file){
                    console.log(req.body);
                    console.log(req.file);
  
                
                } }
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
  postLogin,
  postRegister,
  postSendOtp,
  getSendOtp,
  getUpdateProfile,
  postUpdateProfile,
  postUpdateProfilePic,
  logout,
};




