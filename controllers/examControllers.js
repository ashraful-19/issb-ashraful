const express = require ("express");
const { ExamSetting, Question } = require('../models/examModel');
const {MilitaryCourse} = require('../models/militaryCourseModel');

const ejs = require('ejs');
const {  ConnectionClosedEvent } = require("mongodb");



const getExamList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // current page, default to 1
    const perPage = 5; // number of exams per page

    let data = await ExamSetting.find({}, null, { sort: { exam_code: -1 } });
    const count = data.length; // Count total exams

    const totalPages = Math.ceil(count / perPage); // Calculate total pages

    console.log(page, perPage, count, totalPages);

    data = data.map(({ _id, exam_type, exam_code, exam_name, status, add_iq, createdAt, questions }) => ({
      _id,
      exam_type,
      exam_code,
      exam_name,
      add_iq,
      status,
      createdAt,
      questions_length: questions ? questions.length : 0
    }));
    console.log(data);

    const ExamsOnPage = data.slice((page - 1) * perPage, page * perPage);

    res.render('admin/createiqlist', { content: ExamsOnPage, title: "verbal", currentPage: page,
    totalPages: totalPages, });

  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately, perhaps by sending an error response
    res.status(500).send('Internal Server Error');
  }
};


  const createExam = async (req, res) => {
    try {
      console.log(req.body);
      const lastExam = await ExamSetting.findOne().sort({ exam_code: -1 }).exec();
    
      let lastCreatedExam = 2;


      if (lastExam) {
        // Handle the case where there are no exam records in the database
        lastCreatedExam = lastExam.exam_code + 2;
        
      }else{
        //if there is no exams found
       lastCreatedExam = 2;
      }
    
      
      // Create a new verbal IQ record using the last created exam code
      const examSetting = new ExamSetting({
        exam_code: lastCreatedExam,
        exam_name: req.body.exam_name,
        
      });

      console.log(examSetting)
      // Save the new verbal IQ record to the database
      const savedExam = await examSetting.save();
  
      // Send a success response to the client
      res.redirect(`/iq/create/${lastCreatedExam}/settings`);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  


  const examSettings = async (req, res) => {
    try {
      const examCode = req.params.id;
      console.log(examCode)
      const examSettings = await ExamSetting.findOne({exam_code:examCode});
      console.log(examSettings);
      const courseList = await MilitaryCourse.find({}, { course_name: 1, course_id: 1 });
      console.log(courseList)
      res.render('admin/iq_settings', { content: examSettings, courseList })
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };

  const examGroupSettings = async (req, res) => {
    try {
      const examCodes = req.query.quizid; // Exam codes array e.g., ['128', '126', '124', '122', '120']
      const courseList = await MilitaryCourse.find({}, { course_name: 1, course_id: 1 });
      console.log(courseList)
      // Convert the array of strings to an array of integers
      const examCodeIntegers = examCodes.map(code => parseInt(code, 10));
  console.log(examCodeIntegers)
      // Find exams in ExamSetting where the exam_code is in the array
      const data = await ExamSetting.find({ exam_code: { $in: examCodeIntegers } })
        .select('exam_name exam_code') // Select only exam_name and exam_code fields
        .exec();
  
      console.log(data);
      res.render('admin/iq_settings_group', { content: data, courseList });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  



  const examGroupSettingsUpdate = async (req, res) => {
    try {
      const {
        instruction,
        conclusion_text,
        time,
        attempt,
        randomize,
        negative_marking,
        custom_message,
        show_result,
        show_merit,
        practice,
        show_explanation,
        active_status,
        course_added,
       
        is_anyone,
        passing_score1,
        passing_score2,
        failing_score,
        message_on_pass1,
        message_on_pass2,
        message_on_fail,
      } = req.body;
  
      console.log(req.body);
  
      const examCodes = req.query.quizid; // Exam codes array e.g., ['128', '126', '124', '122', '120']
  
      // Convert the array of strings to an array of integers
      const examCodeIntegers = examCodes.map(code => parseInt(code, 10));
  
      // Construct the update object with only non-empty values
      const updateObject = {
        ...(instruction && { instruction }),
        ...(conclusion_text && { conclusion_text }),
        ...(time !== undefined && { time }),
        attempt: attempt === 'unlimited' ? null : parseInt(attempt, 10),
        randomize: randomize === 'on',
        negative_marking: negative_marking === 'on',
        custom_message: custom_message === 'on',
        show_result: show_result === 'on',
        show_merit: show_merit === 'on',
        practice: practice === 'on',
        show_explanation: show_explanation === 'on',
        ...(active_status && { active_status }),
        ...(course_added && { course_added }),
        is_anyone: is_anyone === 'on',
        ...(passing_score1 && { passing_score1 }),
        ...(passing_score2 && { passing_score2 }),
        ...(failing_score && { failing_score }),
        ...(message_on_pass1 && { message_on_pass1 }),
        ...(message_on_pass2 && { message_on_pass2 }),
        ...(message_on_fail && { message_on_fail }),
      };
  
      // Update multiple documents using updateMany
      const updateResult = await ExamSetting.updateMany(
        { exam_code: { $in: examCodeIntegers } }, // Find documents with exam codes in the array
        {
          $set: updateObject,
        }
      );
  
      console.log(`Updated exam settings`);
      console.log(updateResult);
      res.redirect(`/iq/create/verbal`);
    } catch (error) {
      console.error('Error updating settings:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
  };
  


  const deleteIq = async (req, res) => {
    try {
      const examCode = req.params.id;
  
      // Find and delete ExamSetting
      const examSettingData = await ExamSetting.findOne({ exam_code: examCode });
  
      if (!examSettingData) {
        return res.status(404).send('Exam IQ not found');
      }
  

 // Delete questions associated with the exam code from the Question database
 await Question.deleteMany({ exam_code: examCode });
  

      await ExamSetting.deleteOne({ exam_code: examCode });
  
     
      res.redirect(`/iq/create/${examSettingData.exam_type}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  
  const updateSettings = async (req, res) => {
    try {
      const {
        exam_name,
        instruction,
        conclusion_text,
        time,
        attempt,
        randomize,
        negative_marking,
        custom_message,
        show_result,
        show_merit,
        practice,
        show_explanation,
        active_status,
        course_added,
   
        is_anyone,
        passing_score1,
        passing_score2,
        failing_score,
        message_on_pass1,
        message_on_pass2,
        message_on_fail,
      } = req.body;
  
      const examCode = req.params.id;
  
      const updateExamSetting = await ExamSetting.findOne({ exam_code: examCode });
      if (!updateExamSetting) {
        return res.status(404).json({ success: false, message: 'Exam not found' });
      }
  
      const updateFields = {
        randomize: randomize === 'on',
        negative_marking: negative_marking === 'on',
        custom_message: custom_message === 'on',
        show_result: show_result === 'on',
        show_merit: show_merit === 'on',
        practice: practice === 'on',
        show_explanation: show_explanation === 'on',
        is_anyone: is_anyone === 'on',
      };
  
      for (const [key, value] of Object.entries(updateFields)) {
        if (value !== undefined) {
          updateExamSetting[key] = value;
        } else {
          updateExamSetting[key] = false;
        }
      }
  
      updateExamSetting.exam_name = exam_name;
      updateExamSetting.instruction = instruction;
      updateExamSetting.conclusion_text = conclusion_text;
      updateExamSetting.attempt = attempt === 'unlimited' ? null : parseInt(attempt, 10);
      updateExamSetting.time = !isNaN(parseInt(time)) ? parseInt(time) : 0;
      updateExamSetting.passing_score1 = passing_score1;
      updateExamSetting.passing_score2 = passing_score2;
      updateExamSetting.failing_score = failing_score;
      updateExamSetting.message_on_pass1 = message_on_pass1;
      updateExamSetting.message_on_pass2 = message_on_pass2;
      updateExamSetting.message_on_fail = message_on_fail;
      updateExamSetting.active_status = active_status;
      updateExamSetting.course_added = course_added;
  
      await updateExamSetting.save();
      console.log('Updated settings');
      res.redirect(`/iq/create/verbal/${examCode}/edit`);
    } catch (error) {
      console.error('Error updating settings:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
  };
  




const getEditQuestions = async (req, res) => {
  try {
    const examCode = req.params.id;
    console.log(examCode);

    const data = await ExamSetting.findOne({ exam_code: examCode })
      .populate({
        path: 'questions',
        options: { sort: { order: -1 } }, // Sort by order in descending order
      })
      .exec(); // Explicitly call .exec() to execute the query

    const content = data.questions;
    // console.log(content);

    res.render('admin/edit-verbal-question', { content: content, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

  const deleteQuestion = async (req, res) => {
    try {
        const examCode = req.params.id;
        const deleteId = req.query.delete;
        console.log(examCode, deleteId);

        // Assuming Question and ExamSetting models are defined

        const data = await Question.deleteOne({ exam_code: examCode, _id: deleteId });
        console.log(data)
        const dataRef = await ExamSetting.findOneAndUpdate(
            { exam_code: examCode },
            { $pull: { questions: deleteId } },
            { new: true }
        ).populate('questions');
        console.log(dataRef)
        res.status(200).json({ data: "Data deleted successfully", updatedData: dataRef });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

const saveOrUpdateQuestion = async (req, res) => {
  try {
    const {
      field_type,
      exam_type,
      subject,
      chapter,
      topic,
      board,
      year,
      version,
      question,
      option,
      answer,
      explanation,
      order,
    } = req.body;
console.log('insert,clone , type changes er jnno')
    console.log(req.body.option, req.body.answer);

    const examCode = req.params.id;
    const quesId = req.query.id;
  
    // Find the highest order value for the given exam_code
    const highestOrder = await Question.findOne({ exam_code: examCode })
      .sort({ order: -1 })
      .select('order');

    // console.log('heigher order id from submit:',highestOrder)

    const newOrder = highestOrder ? highestOrder.order + 1 : 1;

    // Create a new question or find the existing question by ID
    const existingQuestion = quesId ? await Question.findById(quesId) : null;
    // console.log('existing question:',existingQuestion)

    const updatedQuestion = existingQuestion || new Question();
    // console.log('updatedquestion question:',updatedQuestion)
    // Update the fields of the question
    updatedQuestion.field_type = field_type;
    updatedQuestion.exam_code = examCode;
    updatedQuestion.exam_type = exam_type;
    updatedQuestion.subject = subject;
    updatedQuestion.chapter = chapter;
    updatedQuestion.topic = topic;
    updatedQuestion.board = board;
    updatedQuestion.year = year;
    updatedQuestion.version = version;
    updatedQuestion.question = question;
    updatedQuestion.option = option;
    updatedQuestion.answer = answer;
    updatedQuestion.explanation = explanation;
    updatedQuestion.order = order || (existingQuestion ? existingQuestion.order : newOrder);

    // Save the question to the database
    await updatedQuestion.save();

    // If it's a new question, update examSetting
    if (!existingQuestion) {
      const examSetting = await ExamSetting.findOne({ exam_code: examCode });
      examSetting.questions.push(updatedQuestion);
      await examSetting.save();

      // Return the newly added question's ID as part of the response
      return res.json({ success: true, questionId: updatedQuestion._id });
    }

    // Get all the questions for the exam, including the new/updated question
    const allQuestions = await Question.find({ exam_code: examCode });
    // console.log(allQuestions)

    // Redirect or respond based on your use case
    res.redirect(`/iq/create/verbal/${examCode}/edit`);
    // Or you can send a JSON response if you are using AJAX
    // res.json({ success: true, message: 'Question saved/updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};



  
  const orderQuestions = async (req, res) => {
    try {
      // Extract examCode from the URL parameter and ids from the request body
      const examCode = req.params.id;
      const ids = req.body.sortedItems;
      console.log(ids, examCode);
  
      // Fetch questions from the database based on the examCode
      const questions = await Question.find({ exam_code: examCode });
    
      for (let i = 0; i < ids.length; i++) {
        console.log(ids[i]);
        const id = ids[i];
      
        // Find the question in the questions array with matching ID
        const question = questions.find(q => q._id.toString() === id);
      
        if (question) {
          // Update the order property of the question to match the loop index in reverse
          question.order = (ids.length - i);
          // Save the updated question back to the database
          await question.save();
        }
      }
      
      // Respond with success message if everything worked as expected
      res.status(200).json({ success: true, message: "Question list order updated successfully" });
    } catch (error) {
      // If an error occurs, log it and respond with an error message
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to update question list order" });
    }
  };
  


module.exports = {
  examSettings,
  examGroupSettings,
  examGroupSettingsUpdate,
  updateSettings,
  getExamList,  
  createExam,  
  saveOrUpdateQuestion,
  getEditQuestions,
  deleteIq,
  deleteQuestion,
  orderQuestions,
};




