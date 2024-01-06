const express = require ("express");
const mongoose = require('mongoose');
const axios = require("axios");
const { v4: uuid } = require("uuid");
const {MilitaryCourse} = require('../models/militaryCourseModel');
const {User} = require("../models/userModel");
const {Payment} = require("../models/paymentModel");
const { createPayment, executePayment } = require('bkash-payment')
const app = express();

const flash = require('connect-flash');
const { restart } = require("nodemon");

const bkashConfig = {
  base_url : 'https://tokenized.pay.bka.sh/v1.2.0-beta',
  username: '01839886977',
  password: '.&$9Bc{KD-i',
  app_key: 'sEJzTU0Ov1KgoBj8ebUT5lnTtc',
  app_secret: 'J8qfRS7JbtjFXCh6vG7wawLxGVOT9zk9s0RYYpK2ZsR9UfxRMth3'
 }




const getPayment = async (req, res) => {
  try {
    const courseId = req.query.course_id;
    const courseObject = await MilitaryCourse.findOne({ course_id: courseId });
    
    if (!courseObject) {
      req.flash('error', 'Course not found');
      return res.redirect('/');
    }

    const paymentDetails = {
      amount: courseObject.course_fee,
      callbackURL: 'http://localhost:3000/bkash-callback',
      orderID: 'Order_' + uuid(),
      reference: courseId,
    };

    const result = await createPayment(bkashConfig, paymentDetails);
    console.log(result)
    res.redirect(result?.bkashURL);
  } catch (e) {
    console.log(e);
  }
};






const postPayment = async (req, res) => {
   
  try {

    const { status, paymentID } = req.query;
    console.log(req.query)
    let result;

    if (status === 'success') {
      result = await executePayment(bkashConfig, paymentID);

      if (result?.transactionStatus === 'Completed') {   

        console.log(result?.transactionStatus)

        // Payment success
        const courseId = result?.payerReference; // Get the courseId from the reference
        const userPhone = req.user.phone;

        const userObject = await User.findOne({ phone: userPhone });
        const courseObject = await MilitaryCourse.findOne({ course_id: courseId });

        if (userObject && courseObject) {
          const payment = new Payment({
            user: userObject._id,
            course: courseObject._id,
            course_id: courseObject.course_id,
            paymentPhone: result?.payerInfo?.payerPhone || userPhone,
            amount: result?.amount || 0,
            paymentMethod: 'bKash',
            transactionId: paymentID,
            is_active: true,
            is_banned: false,
          });

          await payment.save();
          console.log('payment saved in database');
          req.flash('success', 'Payment has been successful');
        } else {
          req.flash('error', 'User or course not found please contact admin');
        }
      }else {
        console.log(result.statusMessage) //payment failed page....


      }
    } else {
      console.log(status) //payment failed page....
    }
console.log(result,'payment doneeeee.')
req.flash('success', 'Payment has been successful');
    res.redirect('/dashboard'); // Redirect to your desired route
  } catch (e) {
    console.log(e);
  }
};




         




// app.get("/bkash-callback", async(req, res) => {
//   try {
//     const { status, paymentID } = req.query
//     let result
//     let response = {
//       statusCode : '4000',
//       statusMessage : 'Payment Failed'
//     }
//     if(status === 'success')  result =  await executePayment(bkashConfig, paymentID)

//     if(result?.transactionStatus === 'Completed'){
//       // payment success 
//       // insert result in your db 
//     }
//     if(result) response = {
//       statusCode : result?.statusCode,
//       statusMessage : result?.statusMessage
//     }
//    res.redirect('your_frontend_route')  // Your frontend route
//   } catch (e) {
//     console.log(e)
//   }
// })

module.exports = {
  postPayment,
  getPayment,
};




