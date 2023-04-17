const mongoose = require('mongoose');
const MilitaryCourseSchema = new mongoose.Schema({
    course_id: {
      type: Number,
      required: true
    },
    course_name: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    course_ads: {
      type: String,
    },
    course_description: {
      type: String,
    },course_fee: {
      type: Number,
    },
    course_syllabus: [{
            course_content_icon_url: {
              type: String,
            },
            course_content_title: {
              type: String,
            },
            course_content_details: [{
                type: {
                  type: String,
                  
                },
                title: {
                  type: String,
                  
                },
                link: {
                  type: String,
                }
              }
            ],
            order: {
              type: Number,
            }
          }],
    is_active: {
      type: Boolean,
    },
    is_update: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  // const MilitaryCourseSyllabusSchema = new mongoose.Schema({
  //   course_id: {
  //     type: Number,
  //     required: true,
  //   },
  //   course_content_icon_url: {
  //     type: String,
  //   },
  //   course_content_title: {
  //     type: String,
  //   },
  //   course_content_details: [
  //     {
  //       type: {
  //         type: String,
          
  //       },
  //       title: {
  //         type: String,
          
  //       },
  //       link: {
  //         type: String,
  //       },
  //     },
  //   ],
  //   order: {
  //     type: Number,
  //   },
  //   createdAt: {
  //     type: Date,
  //     default: Date.now,
  //   },
  // });mongoose.model(name, schema)
  

const MilitaryCourse = mongoose.model('military_course', MilitaryCourseSchema);
// const MilitaryCourseSyllabus = mongoose.model('military_course_syllabus', MilitaryCourseSyllabusSchema);
  
module.exports = {
  MilitaryCourse,
  // MilitaryCourseSyllabus
};
