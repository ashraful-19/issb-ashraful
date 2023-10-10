const express = require ("express");
const {User} = require("../models/userModel");
const {Doubt} = require("../models/iqModel");
const {MilitaryCourse} = require('../models/militaryCourseModel');
const {Payment} = require("../models/paymentModel");
const getIndex = async (req, res) => {
  try {
    res.render('issb/index');
    } 
    catch (error) {
   console.log(error.message);
  }};


const getDoubts = async (req, res) => {
  try {

  
    const data = await Doubt.findOne({ user: req.user }).populate({
      path: "question_id",
      options: { sort: { createdAt: -1 } },
    });
    console.log(data.question_id);
  //   let content = data.questions;
    
  //   const userDoubts = await Doubt.findOne({ user: userId });
  //   if(userDoubts){
  //   var newContent = content.map((item) => {
  //     const hasDoubt = userDoubts.question_id.some(
  //       (doubt) => doubt.equals(item._id)
  //     );
  //     return { ...item._doc, doubt: hasDoubt ? 1 : 0 };
  //   });
  // }else{
  //     newContent = content;
  // }
  //   console.log(newContent);

  //   // Render the page inside the aggregate callback
  //   res.render("issb/iqexam", { content: newContent, data });
  //   console.log(problem);
    res.render('issb/doubts',{data: data.question_id});
    } 
    catch (error) {
   console.log(error.message);
  }};





const getTermsAndConditions = async (req, res) => {
  try {
    res.render('issb/terms&conditions');
    } 
    catch (error) {
   console.log(error.message);
  }};



  const getCourses = async (req, res) => {
  try {
    const course = await MilitaryCourse.find({}).sort({ course_id: -1 }).exec();
      console.log(course)

    res.render('issb/course-list',{course});
    } 
    catch (error) {
   console.log(error.message);
  }};

  const getCourseDetails = async (req, res) => {
    try {
     
      const courseId = req.params.id;
      const course = await MilitaryCourse.findOne({course_id: courseId}).sort({ course_id: -1 }).exec();
      console.log(course)
  
      res.render('issb/course-details',{course});
      } 
      catch (error) {
     console.log(error.message);
    }};
    const getCourseLecture = async (req, res) => {
      try {
       
        const courseId = req.params.id;
        const course = await MilitaryCourse.findOne({course_id: courseId}).sort({ course_id: -1 }).exec();
        console.log(course)
    
        res.render('issb/coursevideo',{course});
        } 
        catch (error) {
       console.log(error.message);
      }};
    
  const getDashboard = async (req, res) => {
    try {
      const user = await User.findOne({ phone: req.user.phone }); 
      const userId = req.user._id;
      const payment = await Payment.find({ user: userId, is_active: true }).populate({
        path: 'course',
        select: 'course_id course_name thumbnail'
      });
      
      console.log(payment);
      res.render('issb/dashboard',{user: user,payment});
      } 
      catch (error) {
     console.log(error.message);
    }};


  const getProfile = async (req, res) => {
    try {
      const user = await User.findOne({ phone: req.user.phone });
      
   
      res.render('issb/editprofile',{user: user});
      } 
      catch (error) {
     console.log(error.message);
    }};





module.exports = {
  getIndex,
  getCourses,
  getDoubts,
  getProfile,
  getDashboard,
  getCourseDetails,
  getCourseLecture,
  getTermsAndConditions,
};




