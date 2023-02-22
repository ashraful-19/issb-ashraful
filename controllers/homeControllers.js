const express = require ("express");

const getIndex = async (req, res) => {
  try {
    res.render('index');
    } 
    catch (error) {
   console.log(error.message);
  }};


const getDoubts = async (req, res) => {
  try {
    res.render('doubts');
    } 
    catch (error) {
   console.log(error.message);
  }};

  const getResults = async (req, res) => {
  try {
    res.render('results');
    } 
    catch (error) {
   console.log(error.message);
  }};
  const getProfile = async (req, res) => {
    try {
      
      res.render('profile',{user: req.user});
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




