const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  name: {
    type: String,
    
  },
  institution: {
    type: String,
    
  },
  college: {
    type: String,
    
  },
  course: {
    type: String,
    
  },
  email: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const otpSchema = new mongoose.Schema({
    phone: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 100 }
    }
  });
  
  const User = mongoose.model('User', userSchema);
  const Otp = mongoose.model('Otp', otpSchema);
  
  module.exports = {
    User,
    Otp
  };