const mongoose = require('mongoose');

const iqSettingSchema = new mongoose.Schema({
  exam_type: {
    type: String,
  },
  exam_code: {
    type: Number,
    default: 1000,
  },
  exam_name: {
    type: String
  },
  instruction: {
    type: String
  },
  randomize: {
    type: String,
    default: true,
  },
  add_iq: {
    type: String,
    default: true,
  },
  status: {
    type: String,
    default: true,
  },
  conclusion_text: {
    type: String,
  },
  time: {
    type: Number,
  },
  questions: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VerbalQuestion'
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

  const verbalQuestionSchema = new mongoose.Schema({
    exam_code: {
      type: String,
    },
    question_type: {
    type: String,
  },
  question: {
    type: String,
  },
  question_image: {
    type: String,
  },
  choice1: {
    type: String,
  },
  choice2: {
    type: String,
  },
  choice3: {
    type: String,
  },
  choice4: {
    type: String,
  },
  choice5: {
    type: String,
  },
  choice6: {
    type: String,
  },
  answer: {
    type: String,
  },
  explanation: {
    type: String,
  },
  explanation_extra: {
    type: String,
  },
  explanation_image: {
    type: String,
  },
  doubts_count: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



const DoubtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  question_id: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VerbalQuestion'
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const IqSetting = mongoose.model('iq_setting', iqSettingSchema);
const VerbalQuestion = mongoose.model('VerbalQuestion', verbalQuestionSchema);
const Doubt = mongoose.model('doubt', DoubtSchema);

module.exports = {
  IqSetting,
  VerbalQuestion,
  Doubt
};
