const express = require ("express");
const mongoose = require('mongoose');
const axios = require("axios");
const { v4: uuid } = require("uuid");
const {MilitaryCourse} = require('../models/militaryCourseModel');
const {User} = require("../models/userModel");
const {Payment} = require("../models/paymentModel");


    const postPayment = async (req, res) => {
      try {
        const courseId = req.query.course_id;        
        const userPhone = req.user.phone;
        const course = await MilitaryCourse.findOne({course_id: courseId}).sort({ course_id: -1 }).exec();
        const user = await User.findOne({phone: userPhone});
        const formData = {
          cus_name: user.name || 'hello',
          cus_email: user.email ||"hello@gmail.com",
          cus_phone: user.phone,
          course_id: courseId,
          amount: course.course_fee,
          tran_id: uuid(),
          signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
          store_id: "aamarpaytest",
          currency:"BDT",
          desc:"payment has done for a course",
          cus_add1: "53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh",
          cus_add2: "Dhaka",
          cus_city: "Dhaka",
          cus_country: "Bangladesh",
          success_url: "http://localhost:3000/callback/success",
          fail_url: "http://localhost:3000/callback/failed",
          cancel_url: "http://localhost:3000/callback",
          type: "json", //This is must required for JSON request
        };
        const { data } = await axios.post(
          "https://sandbox.aamarpay.com/jsonpost.php",
          formData
        );


        const { cus_phone, course_id, amount, paymentDate, validity, paymentMethod, status, transactionId } = req.body;
        console.log(courseId)
   // Find the user and course objects from the database using their ObjectId
   const userObject = await User.findOne({phone: userPhone });
 const courseObject = await MilitaryCourse.findOne({course_id: courseId});
console.log(userObject)
console.log(courseObject)
// Create a new payment object using the retrieved user and course objects
   const payment = new Payment({
     user: userObject._id,
     course: courseObject._id,
     amount: courseObject.course_fee,
     paymentDate,
     validity,
     paymentMethod: 'Bkash',
     status: 'Success',
     transactionId:uuid()
   });

console.log(payment);
   // Save the payment object to the database
   await payment.save();

   res.status(201).send(payment);






        console.log(data);
        if (data.result !== "true") {
          let errorMessage = "";
          for (let key in data) {
            errorMessage += data[key] + ". ";
          }
          return res.render("error", {
            title: "Error",
            errorMessage,
          });
        }
      
        // res.status(301).redirect(data.payment_url);


          
    //     // Send a success response to the client
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
  getSuccess,
  getFailed,
};




