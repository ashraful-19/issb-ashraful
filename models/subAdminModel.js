const mongoose = require('mongoose');

const ppdtorstorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  hint: {
    type: String
  },
  solve: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
});

const planningSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  content_text: {
    type: String,
  },
  written: {
    type: String,
  },
  discussion: {
    type: String,
  }
});

const videoContentSchema = new mongoose.Schema({
  type: {
    type: String,
   },
  title: {
    type: String,
  },
  video_link: {
    type: String,
  },
  order: {
    type: Number,
    default: 0
  },
});

const textContentSchema = new mongoose.Schema({
  type: {
    type: String,
    
  },
  text_type: {
    type: String,
    
  },
  title: {
    type: String,

  },
  solve: {
    type: String
  },
  hint: {
    type: String
  }
});

const Ppdtorstory = mongoose.model('ppdtorstory', ppdtorstorySchema);
const PlanningContent = mongoose.model('planning', planningSchema);
const VideoContent = mongoose.model('videoContent', videoContentSchema);
const TextContent = mongoose.model('textContent', textContentSchema);

module.exports = {
  Ppdtorstory,
  PlanningContent,
  VideoContent,
  TextContent,
};
