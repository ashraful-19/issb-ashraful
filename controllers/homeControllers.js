const express = require ("express");
const {User} = require("../models/userModel");
const {Doubt} = require("../models/iqModel");

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

  const getResults = async (req, res) => {
  try {
    res.render('issb/results');
    } 
    catch (error) {
   console.log(error.message);
  }};
  const getProfile = async (req, res) => {
    try {
      const user = await User.findOne({ phone: req.user.phone });
      
   
      res.render('issb/profile',{user: user});
      } 
      catch (error) {
     console.log(error.message);
    }};





module.exports = {
  getIndex,
  getResults,
  getDoubts,
  getProfile,
};




