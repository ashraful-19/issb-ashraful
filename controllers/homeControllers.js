const express = require ("express");
const {User} = require("../models/userModel");
const getIndex = async (req, res) => {
  try {
    res.render('issb/index');
    } 
    catch (error) {
   console.log(error.message);
  }};


const getDoubts = async (req, res) => {
  try {
    res.render('issb/doubts');
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




