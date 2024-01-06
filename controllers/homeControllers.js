const express = require ("express");
const {User} = require("../models/userModel");
const {Doubt} = require("../models/examModel");
const {MilitaryCourse} = require('../models/militaryCourseModel');
const {Payment} = require("../models/paymentModel");
const getIndex = async (req, res) => {
  try {
    res.render('issb/index.ejs');
    } 
    catch (error) {
   console.log(error.message);
  }};

  const getDoubts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // current page, default to 1
      const perPage = 5; // number of doubts per page
  
      const data = await Doubt.findOne({ user: req.user }).populate({
        path: "question_ids",
        options: { sort: { createdAt: -1 } },
      });
  
      if (!data || !data.question_ids) {
        // Handle the case where no doubts are found
        res.render('issb/doubts', {
          data: [],
          currentPage: 1,
          totalPages: 1,
        });
        return;
      }
  
      const count = data.question_ids.length; // Count total doubts
  
      const totalPages = Math.ceil(count / perPage); // Calculate total pages
  
      console.log(page, perPage, count, totalPages);
  
      // Slice the doubts to get the ones for the current page
      const doubtsOnPage = data.question_ids.slice((page - 1) * perPage, page * perPage);
  
      res.render('issb/doubts', {
        data: doubtsOnPage,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  };
  

  const getCourses = async (req, res) => {
  try {
    const course = await MilitaryCourse.find({is_active: true}).sort({ course_id: -1 }).exec();
      console.log(course)

    res.render('issb/course-list.ejs',{course});
    } 
    catch (error) {
   console.log(error.message);
  }};

  const getCourseDetails = async (req, res) => {
    try {
     console.log('ekhne ekta error ache undefied id')
      const courseId = req.params.id;
      const course = await MilitaryCourse.findOne({course_id: courseId}).sort({ course_id: -1 }).exec();
      console.log(course)
      
  
      res.render('issb/course-details',{course});
      } 
      catch (error) {
     console.log(error.message);
    }};

    const getLessonVideo = async (req, res) => {
      try {
        const type = req.query.type;
        const courseId = 1;
            const course = await MilitaryCourse.findOne({ course_id: courseId }).sort({ course_id: -1 }).exec();
            console.log(course);
            console.log(course.course_syllabus);
        
            // Filter out items with non-numeric order values and non-empty course_content_type
            const validSyllabus = course.course_syllabus.filter(item => !isNaN(item.order) && item.course_content_type.trim() !== '');
        
            // Sort the syllabus based on the numeric order
            const sortedSyllabus = validSyllabus.sort((a, b) => a.order - b.order);
        
            // Extract course_content_type from the sorted syllabus
            const courseTypes = sortedSyllabus.map(item => item.course_content_type);
        
            console.log('Content Types:', courseTypes);
            res.render('issb/lessonvideo', { course, courseTypes, type });
        } 
        catch (error) {
       console.log(error.message);
      }};
    



    const getCourseLecture = async (req, res) => {
      try {
        const courseId = req.params.id;
        const course = await MilitaryCourse.findOne({ course_id: courseId }).sort({ course_id: -1 }).exec();
        console.log(course);
        console.log(course.course_syllabus);
    
        // Filter out items with non-numeric order values and non-empty course_content_type
        const validSyllabus = course.course_syllabus.filter(item => !isNaN(item.order) && item.course_content_type.trim() !== '');
    
        // Sort the syllabus based on the numeric order
        const sortedSyllabus = validSyllabus.sort((a, b) => a.order - b.order);
    
        // Extract course_content_type from the sorted syllabus
        const courseTypes = sortedSyllabus.map(item => item.course_content_type);
    
        console.log('Content Types:', courseTypes);
        res.render('issb/course-lecture', { course, courseTypes });
      } catch (error) {
        console.log(error.message);
      }
    };
    
    
    const getDashboard = async (req, res) => {
      try {
        const user = await User.findOne({ phone: req.user.phone });
        const userId = req.user._id;
        
        // Fetch payments with courses, and filter by validityDate > current date
        const payments = await Payment.find({ user: userId, is_active: true, validityDate: { $gt: new Date() } })
          .populate({
            path: 'course',
            select: 'course_id course_name thumbnail'
          });
    
        console.log(payments);
        res.render('issb/dashboard', { user, payments });
      } catch (error) {
        console.log(error.message);
        // Handle the error appropriately, perhaps by sending an error response to the client
        res.status(500).send('Internal Server Error');
      }
    };
    

  const getProfile = async (req, res) => {
    try {
      const user = await User.findOne({ phone: req.user.phone });
      
   
      res.render('issb/editprofile',{user: user});
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
    const getPrivacyAndPolicy = async (req, res) => {
      try {
        res.render('issb/privacy&policy');
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
  getLessonVideo,
  getCourseLecture,
  getTermsAndConditions,
  getPrivacyAndPolicy,
};




