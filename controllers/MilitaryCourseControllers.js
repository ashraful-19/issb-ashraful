const express = require ("express");
const mongoose = require('mongoose');
const {MilitaryCourse} = require('../models/militaryCourseModel');


const getCourse = async (req, res) => {
  try {
    const course = await MilitaryCourse.find({}, { course_id: 1, course_name: 1, thumbnail: 1 }).sort({ course_id: -1 }).exec();
    res.render('admin/course',{course: course});
    } 
    catch (error) {
   console.log(error.message);
  }};
  const getCreateCourse = async (req, res) => {
    try {
      res.render('admin/create-course');
      } 
      catch (error) {
     console.log(error.message);
    }};
    
    
    const postCreateCourse = async (req, res) => {
      try {
        const courseId = req.query.course_id;

        
        
        if (courseId) {
          // If course id is present in the query parameter, update existing course
          const createCourse = await MilitaryCourse.findOneAndUpdate(
            { course_id: courseId },
            {
              course_name: req.body.course_name,
              thumbnail: req.body.thumbnail,
              course_description: req.body.course_description,
              course_ads: req.body.course_ads,
              course_fee: req.body.course_fee,
              is_update: req.body.is_update,
              is_active: req.body.is_active,
            },
            { new: true } // Return updated document
          );
          console.log('Course updated:', createCourse);

          res.redirect(`/admin/course/update/${courseId}`);
        } else {
          // If course id is not present in the query parameter, create a new course
          console.log('im here')
            const lastCourse = await MilitaryCourse.findOne().sort({ course_id: -1 }).exec();

    console.log(lastCourse)
            const lastCreatedCourse = lastCourse.course_id + 1;
    console.log(lastCreatedCourse)
          // Create a new Course record using the last created Course code
        const  createCourse = new MilitaryCourse({
            course_id: lastCreatedCourse,
            course_name: req.body.course_name,
            thumbnail: req.body.thumbnail,
            course_description: req.body.course_description,
            course_ads: req.body.course_ads,
            course_fee: req.body.course_fee,
            is_update: req.body.is_update,
            is_active: req.body.is_active,
          });
    
          console.log('New course created:', createCourse);
    
          // Save the new Course to the database
          await createCourse.save();
          console.log('im here save er por')
        res.redirect(`/admin/course/update/${createCourse.course_id}`);
    
          
        }
            

    
    //     // Send a success response to the client
      } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
    };
    
    
      const getUpdateCourse = async (req, res) => {
        try {
         
          const courseId = req.params.id;
          const course = await MilitaryCourse.findOne({course_id: courseId}).sort({ course_id: -1 }).exec();
          const courseSyllabus = await MilitaryCourse.find({course_id: courseId}).sort({ course_id: -1 }).exec();
          console.log(courseSyllabus)
          res.render('admin/update-course',{courseId,course,courseSyllabus});
          }
          catch (error) {
         console.log(error.message);
        }};


        const postUpdateCourseSyllabusList = async (req, res) => {
          try {
            const courseId = req.params.id;
            const courseSyllabusIcon = req.body.course_content_icon_url || [];
            const courseSyllabus = req.body.course_content_title || [];
            const courseSyllabusIds = req.body.id || [];
            const course = await MilitaryCourse.findOne({ course_id: courseId });
        
            for (let i = 0; i < courseSyllabus.length; i++) {
              const courseSyllabusId = courseSyllabusIds[i];
              const newCourseSyllabusData = {
                course_content_icon_url: courseSyllabusIcon[i],
                course_content_title: courseSyllabus[i],
              };
        
              console.log(newCourseSyllabusData);
        
              console.log(courseSyllabusId);
        
              if (courseSyllabusId) {
                // If courseSyllabusId exists, update the existing record
                await MilitaryCourse.findOneAndUpdate(
                  { 
                    course_id: courseId, 
                    'course_syllabus._id': courseSyllabusId 
                  },
                  { 
                    $set: { 
                      'course_syllabus.$.course_content_icon_url': newCourseSyllabusData.course_content_icon_url,
                      'course_syllabus.$.course_content_title': newCourseSyllabusData.course_content_title 
                    } 
                  },
                  { 
                    new: true 
                  }
                );
                console.log(newCourseSyllabusData)
                console.log('updated');
              } else {
                // If courseSyllabusId does not exist, create a new record
                
                course.course_syllabus.push(newCourseSyllabusData);
              }
            }
        
            await course.save();
            res.redirect(`/admin/course/update-syllabus/${course.course_id}`);
          } catch (error) {
            console.log(error.message);
          }
        };
        

        const deleteCourseSyllabusItem = async (req, res) => {
          try {
            const courseId = req.params.id;
            const syllabusItemId = req.params.syllabus_id;
        
            const course = await MilitaryCourse.findOneAndUpdate(
              { 
                course_id: courseId 
              },
              { 
                $pull: { 
                  course_syllabus: { 
                    _id: syllabusItemId 
                  } 
                } 
              },
              { 
                new: true 
              }
            );
        
            if (course) {
              res.redirect(`/admin/course/update/${courseId}`);
            } else {
              // If the course was not found, return a 404 error
              res.status(404).send('Course not found');
            }
          } catch (error) {
            console.log(error.message);
            res.status(500).send('Error deleting syllabus item');
          }
        };
        

          const getUpdateCourseSyllabus = async (req, res) => {
            try {
              const courseId = req.params.id;
              const course = await MilitaryCourse.findOne({course_id: courseId}).sort({ course_id: -1 }).exec();
              console.log(course)
              res.render('admin/update-course-syllabus',{courseId,course});
              }
              catch (error) {
             console.log(error.message);
            }};     
                 
            // const postUpdateCourseSyllabus = async (req, res) => {
            //   try {
            //     const courseId = req.params.id;
            //     console.log(req.body);
            //     const courseSyllabusId = req.body.id;
            //     const courseSyllabusType = req.body.type || [];
            //     const courseSyllabusTitle = req.body.title || [];
            //     const courseSyllabusLink = req.body.link || [];
            //     const course = await MilitaryCourse.findOne({ course_id: courseId });
            //     // console.log(course);
            
               
            //     for (let i = 0; i < courseSyllabusType.length; i++) {
            //       const newCourseSyllabusData = {
            //         type: courseSyllabusType[i],
            //         title: courseSyllabusTitle[i],
            //         link: courseSyllabusLink[i],
            //       };
            //       console.log(newCourseSyllabusData);
                  
                
            //         course.course_syllabus.course_content_details = [];
            //         course.course_syllabus.course_content_details.push(newCourseSyllabusData);
              
            //         await course.save(); 
            //     }
            // console.log('saved')
            //     await course.save(); // Save the updated document to the database
            //     console.log(course.course_syllabus.course_content_details)
            //     // res.redirect(`/admin/course/update-syllabus/${courseId}`);
            //   } catch (error) {
            //     console.log(error.message);
            //   }
            // };
            const postUpdateCourseSyllabus = async (req, res) => {
              try {
                const courseId = req.params.id;
                const courseSyllabusId = req.body.id;
                const courseSyllabusType = req.body.type || [];
                const courseSyllabusTitle = req.body.title || [];
                const courseSyllabusLink = req.body.link || [];
                const course = await MilitaryCourse.findOne({ course_id: courseId });
            
                // Find the course syllabus with the specified ID
                const courseSyllabus = course.course_syllabus.find(
                  (syllabus) => syllabus._id.toString() === courseSyllabusId
                );
            
                // Push new data to the course syllabus object
                for (let i = 0; i < courseSyllabusType.length; i++) {
                  const newCourseSyllabusData = {
                    type: courseSyllabusType[i],
                    title: courseSyllabusTitle[i],
                    link: courseSyllabusLink[i],
                  };
                  courseSyllabus.course_content_details.push(newCourseSyllabusData);
                }
            
                // Save the updated document to the database
                await course.save();
            
                res.redirect(`/admin/course/update-syllabus/${courseId}`);
              } catch (error) {
                console.log(error.message);
              }
            };
            
            

            const deleteCourseSyllabusItemDetails = async (req, res) => {
              try {
                const courseId = req.params.id;
                const courseSyllabusId = req.params.syllabus_id;
                const courseSyllabusDetailsId = req.params.details_id;
                const course = await MilitaryCourse.findOne({ course_id: courseId });
            
                // Find the course syllabus with the specified ID
                const courseSyllabus = course.course_syllabus.find(
                  (syllabus) => syllabus._id.toString() === courseSyllabusId
                );
            
                // Find the index of the course syllabus details item to be deleted
                const courseSyllabusDetailsIndex = courseSyllabus.course_content_details.findIndex(
                  (details) => details._id.toString() === courseSyllabusDetailsId
                );
            
                // Remove the course syllabus details item from the array
                courseSyllabus.course_content_details.splice(courseSyllabusDetailsIndex, 1);
            
                // Save the updated document to the database
                await course.save();
            
                res.redirect(`/admin/course/update-syllabus/${courseId}`);
              } catch (error) {
                console.log(error.message);
              }
            };
            


module.exports = {
  getCourse,
  getCreateCourse,
  postCreateCourse,
  getUpdateCourse,
  postUpdateCourseSyllabusList,
  getUpdateCourseSyllabus,
  postUpdateCourseSyllabus,
  deleteCourseSyllabusItem,
  deleteCourseSyllabusItemDetails,
};



