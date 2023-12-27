const mongoose = require('mongoose');

const examSettingSchema = new mongoose.Schema({
  exam_code: {
    type: Number,
    
  },
  exam_name: {
    type: String,
  },  
  instruction: {
    type: String,
  },
  conclusion_text: {
    type: String,
  },
  custom_message: {
    type: Boolean,
    default: false,
  },
  passing_score1: {
    type: Number,
    default: 80,
  },
  
  passing_score2: {
    type: Number,
    default: 50,
  },
  failing_score: {
    type: Number,
    default: 33,
  },
  message_on_pass1: {
    type: String,
  },
  message_on_pass2: {
    type: String,
  },
  message_on_fail: {
    type: String,
  },
  show_result: {
    type: Boolean,
    default: false,
  },
  show_merit: {
    type: Boolean,
    default: false,
  },
  practice: {
    type: Boolean,
    default: false,
  },
  show_explanation: {
    type: Boolean,
    default: false,
  },
  randomize: {
    type: Boolean,
    default: false,
  },
  negative_marking: {
    type: Boolean,
    default: false,
    },
  attempt: {
    type: Number,
    default: 0,
  },
  active_status: {
    type: String,
    default: "closed",
  },
  is_anyone: {
      type: Boolean,
      default: false,
    },  
  course_added: {
    type: [String], // Assuming an array of course names or IDs
  },
  course_tags: {
    type: [String], // Assuming an array of course tags
  },
  time: {
    type: Number,
    default: 0,
  },
  questions: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question', // Referencing the Question model
    }],
  },
  user_result: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserResult', // Referencing the Question model
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


const QuestionSchema = new mongoose.Schema({
  field_type: {
    type: String,
  },
  exam_code: {
    type: String,
  },
  exam_type: {
    type: String,
  },
  subject: {
    type: String,
  },
  chapter: {
    type: String,
  },
  topic: {
    type: String,
  },
  year: {
    type: String,
  },
  board: {
    type: String,
  },
  version: { // Corrected from 'Version'
    type: String,
  },
  question: {
    type: String,
  },
  option: {
    type: [String], // Assuming an array of option strings
  }, 
  answer: {
    type: String,
  },
  explanation: {
    type: String,
  },
  doubts_count: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const DoubtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming there's a 'User' model to reference
    required: true, // Make sure user field is required
  },
  question_ids: [{ // Use an array for multiple question IDs
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question', // Referencing the Question model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Define schema for individual question responses
const questionResponseSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  userAnswer: { type: Number, required: true }, // 0 or 1 indicating incorrect or correct
});

// Define schema for user exam results
const userResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming there's a 'User' model to reference
    required: true, // Make sure user field is required
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  marks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  questions: [questionResponseSchema],
});









const ExamSetting = mongoose.model('ExamSetting', examSettingSchema);
const Question = mongoose.model('Question', QuestionSchema);
const Doubt = mongoose.model('Doubt', DoubtSchema);
// Create a UserResult model using the schema
const UserResult = mongoose.model('UserResult', userResultSchema);


module.exports = {
  ExamSetting,
  Question,
  Doubt,
  UserResult
};
