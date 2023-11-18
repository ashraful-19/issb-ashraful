const express = require ("express");
const { ExamSetting, Question } = require('../models/examModel');
const ejs = require('ejs');
const {  ConnectionClosedEvent } = require("mongodb");





// IQ list show kore jei page okhner 
const getExamList = async (req, res) => {
  try {
   
   
    let data = await ExamSetting.find({}, null, { sort: { exam_code: -1 } });
    
    data = data.map(({ _id,exam_type,exam_code,exam_name,status,add_iq,createdAt,questions }) => ({
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
    res.render('admin/createiqlist', { content: data,title: "verbal" });

   } catch (error) {
   console.log(error.message);
  }};

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
      const data = await ExamSetting.findOne({exam_code:examCode});
      console.log(data);
      res.render('admin/iq_settings', { content: data })
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };


  
  const deleteIq = async (req, res) => {
    try {
      const examCode = req.params.id;
      const data = await ExamSetting.findOne({ exam_code: examCode });
  
      if (!data) {
        return res.status(404).send('Exam IQ not found');
      }
  
      await ExamSetting.deleteOne({ exam_code: examCode });
  
      res.redirect(`/iq/create/${data.exam_type}`);
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
        unlimited_attempt,
        unlimited_time,
        attempt,
        randomize,
        negative_marking,
        custom_message,
        show_score,
        show_right_wrong,
        practice,
        show_explanation,
        active_status,
        course_added,
        startDateTime,
        endDateTime,
        is_live,
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
        show_score: show_score === 'on',
        show_right_wrong: show_right_wrong === 'on',
        practice: practice === 'on',
        show_explanation: show_explanation === 'on',
        is_live: is_live === 'on',
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
      updateExamSetting.unlimited_attempt = unlimited_attempt === 'on';
      updateExamSetting.unlimited_time = unlimited_time === 'on';
      updateExamSetting.attempt = attempt === 'unlimited' ? null : parseInt(attempt, 10);
      updateExamSetting.time = !isNaN(parseInt(time)) ? parseInt(time) : 0;
      updateExamSetting.startDateTime = startDateTime;
      updateExamSetting.endDateTime = endDateTime;
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
        const dataRef = await ExamSetting.findOneAndUpdate(
            { exam_code: examCode },
            { $pull: { questions: deleteId } },
            { new: true }
        ).populate('questions');

        res.status(200).json({ data: "Data deleted successfully", updatedData: dataRef });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
};



const saveQuestion = async (req, res) => {
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
      } = req.body;
      const examCode = req.params.id;
      const examSetting = await ExamSetting.findOne({ exam_code: examCode });

      // Find the highest order value for the given exam_code
      const highestOrder = await Question.findOne({ exam_code: examCode })
          .sort({ order: -1 }) // Sort in descending order to get the highest order
          .select('order'); // Select only the 'order' field

      const newOrder = highestOrder ? highestOrder.order + 1 : 1;

      // Create a new verbal question with the order
      const newQuestion = new Question({
          field_type: field_type,  
          exam_code: examCode,
          order: newOrder,
          exam_type: exam_type,
          subject: subject,
          chapter: chapter,
          topic: topic,
          board: board,
          year: year,
          version: version,
          question: question,
          option: option,
          answer: answer,
          explanation: explanation,
          order: newOrder,
      });

      // Save the new question to the database
      await newQuestion.save();

      examSetting.questions.push(newQuestion);

      // Save the IQ setting with the new question reference
      await examSetting.save();

      // Get all the questions for the exam, including the new question
      const allQuestions = await Question.find({ exam_code: examCode });

      // Render the edit question page with the exam data and all the questions
      res.redirect(`/iq/create/verbal/${examCode}/edit`);
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
  }
};


  const updateQuestion = async (req, res) => {
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
      } = req.body;
  
      const examCode = req.params.id;
      const ques_id = req.query.id;
  
      console.log('dont worry ajaxFrom');
  
      // Find the existing question by its ID
      const existingQuestion = await Question.findById(ques_id);
      if (!existingQuestion) {
        return res.status(404).json({ success: false, message: 'Question not found' });
      }
  
      // Update the fields of the existing question
      existingQuestion.field_type = field_type;
      existingQuestion.exam_code = examCode;
      existingQuestion.exam_type = exam_type;
      existingQuestion.subject = subject;
      existingQuestion.chapter = chapter;
      existingQuestion.topic = topic;
      existingQuestion.board = board;
      existingQuestion.year = year;
      existingQuestion.version = version;
      existingQuestion.question = question;
      existingQuestion.option = option;
      existingQuestion.answer = answer;
      existingQuestion.explanation = explanation;
  
      // Save the updated question to the database
      await existingQuestion.save();
  
      res.json({ value: existingQuestion });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  

  
  const orderQuestions = async (req, res) => {
    try {
      // Extract examCode from the URL parameter and ids from the request body
      const examCode = req.params.id;
      const ids = req.body['id'];
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
  updateSettings,
  getExamList,  
  createExam,

  saveQuestion,
  getEditQuestions,
  deleteIq,
  deleteQuestion,
  updateQuestion,
  orderQuestions,
};




