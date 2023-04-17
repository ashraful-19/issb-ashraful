const express = require ("express");
const mongoose = require('mongoose');
const axios = require("axios");
const { v4: uuid } = require("uuid");
const {MilitaryCourse} = require('../models/militaryCourseModel');
const {User} = require("../models/userModel");
const {Payment} = require("../models/paymentModel");

const flash = require('connect-flash');

const getPayment = async (req, res) => {
  try {
    const courseId = req.query.course_id;
    console.log(courseId)
      res.render('issb/payment',{courseId})
//     // Send a success response to the client
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

const getPaymentSuccess = async (req, res) => {
  try {
    const userId = req.query.user;
    const userCourseObject = await Payment.findOne({ user: userId });
      res.render('issb/payment-success',{userCourseObject})
//     // Send a success response to the client
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};





const postPayment = async (req, res) => {
  try {
    const courseId = req.query.course_id;
    const userPhone = req.user.phone;
    
    console.log(userPhone);
    console.log(courseId);

    // Check that payment_phone, payment_method, and transaction_id exist in req.body
    const { payment_phone, payment_method, transaction_id } = req.body;

    // Find the user and course objects from the database using their ObjectId
    const userObject = await User.findOne({ phone: userPhone });
    const courseObject = await MilitaryCourse.findOne({ course_id: courseId });

    // Check that userObject and courseObject exist
    if (!userObject || !courseObject) {
      req.flash('error', 'User or course not found');
      return res.redirect('/payment?course_id=' + courseId);
    }

    // Check if there is already a payment document for the user and course
    const payment = await Payment.findOne({ user: userObject._id, course: courseObject._id });
    if (!payment) {
      // If no payment document was found, create a new one with the current course
      const newPayment = new Payment({
        user: userObject._id,
        course: courseObject._id,
        course_id: courseObject.course_id,
        paymentPhone: payment_phone,
        amount: courseObject.course_fee,
        paymentMethod: payment_method,
        transactionId: transaction_id,
        is_active: false
      });
      await newPayment.save();
      req.flash('success', ' Payment has been updated first time');
    } else {
      // If a payment document was found, update the payment information
      payment.paymentPhone = payment_phone;
      payment.transactionId = transaction_id;

      await payment.save();
      req.flash('success', ' Payment has been again updated');  
    }

    // Send a success response to the client

  console.log(payment);
    res.redirect('/payment-success?user=' + userObject._id);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

    
      const getSuccess = async (req, res) => {
        try {
         console.log(req.body);
         

//          const { cus_phone, course_id, amount, paymentDate, validity, paymentMethod, status, transactionId } = req.body;
//          console.log(course_id)
//     // Find the user and course objects from the database using their ObjectId
//     const userObject = await User.findOne({phone: cus_phone});
//   const courseObject = await MilitaryCourse.findOne({course_id: course_id});
// console.log(userObject)
// console.log(courseObject)
// // Create a new payment object using the retrieved user and course objects
//     const payment = new Payment({
//       user: userObject._id,
//       course: courseObject._id,
//       amount: courseObject.course_fee,
//       paymentDate,
//       validity,
//       paymentMethod,
//       status,
//       transactionId
//     });

// console.log(payment);
//     // Save the payment object to the database
//     await payment.save();

//     res.status(201).send(payment);
          
          }
          catch (error) {
         console.log(error.message);
        }};


        const getFailed = async (req, res) => {
          try {
           console.log(req.body);
      
            }
            catch (error) {
           console.log(error.message);
          }};
  

module.exports = {
  postPayment,
  getPayment,
  getPaymentSuccess,
  getSuccess,
  getFailed,
};




