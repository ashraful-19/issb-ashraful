const express = require ("express");

const getLessonVideo = async (req, res) => {
  try {
    res.render('lessonvideo');
    } 
    catch (error) {
   console.log(error.message);
  }};

const getPracticePpdt = async (req, res) => {
  try {
    res.render('practiceppdt');
    } 
    catch (error) {
   console.log(error.message);
  }};







module.exports = {
  getLessonVideo,
  getPracticePpdt,
};




