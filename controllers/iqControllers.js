const express = require ("express");
const { IqSetting,VerbalQuestion } = require('../models/iqModel');
const ejs = require('ejs');
const { ConnectionClosedEvent } = require("mongodb");





// IQ list show kore jei page okhner 
const getCreateVerbalIq = async (req, res) => {
  try {
   
   
    let data = await IqSetting.find({exam_type: "verbal"}, null, { sort: { exam_code: -1 } });
    
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

  const createVerbalIq = async (req, res) => {
    try {
      console.log(req.body);
      const lastExam = await IqSetting.findOne().sort({ exam_code: -1 }).exec();
      if (!lastExam) {
        // Handle the case where there are no exam records in the database
        console.log('No exam records found');
        return res.status(404).send('No exam records found');
      }
      console.log(lastExam);
      const lastCreatedExam = lastExam.exam_code + 2;
      console.log(lastCreatedExam);
  
      // Create a new verbal IQ record using the last created exam code
      const verbalIq = new IqSetting({
        exam_type: "verbal",
        exam_name: req.body.exam_name,
        exam_code: lastCreatedExam,
        // add other properties from req.body as needed
      });
      console.log(verbalIq)
  
      // Save the new verbal IQ record to the database
      const savedVerbalIq = await verbalIq.save();
  
      // Send a success response to the client
      res.redirect(`/iq/create/${lastCreatedExam}/settings`);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  


  const settingsIq = async (req, res) => {
    try {
      const examCode = req.params.id;
      console.log(examCode)
      const data = await IqSetting.findOne({exam_code:examCode});
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
      const data = await IqSetting.findOne({ exam_code: examCode });
  
      if (!data) {
        return res.status(404).send('Exam IQ not found');
      }
  
      await IqSetting.deleteOne({ exam_code: examCode });
  
      res.redirect(`/iq/create/${data.exam_type}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };


// Iq list er porer page er ta sobar common update settings
  
  const updateSettings = async (req, res) => {
    try {
      const { exam_name, instruction,randomize,add_iq,status,conclusion_text,time } = req.body;
      console.log(req.body);
      const examCode = req.params.id;
      console.log(examCode)
      const updateExamSetting = await IqSetting.findOne({exam_code: examCode});
      if (!updateExamSetting) {
        return res.status(404).json({ success: false, message: 'Exam not found' });
      }
  
      updateExamSetting.exam_name = exam_name;
      updateExamSetting.instruction = instruction ;
      updateExamSetting.randomize = randomize ;
      updateExamSetting.add_iq = add_iq ;
      updateExamSetting.status = status ;
      updateExamSetting.conclusion_text = conclusion_text ;
      updateExamSetting.time = time;
      console.log(updateExamSetting);
      await updateExamSetting.save();
      res.redirect(`/iq/create/${updateExamSetting.exam_type}/${examCode}/edit`);
      
      
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  








  const getEditVerbalIq = async (req, res) => {
    try {
      const examCode = req.params.id;
      console.log(examCode)
      const data = await IqSetting.findOne({ exam_code: examCode })
  .populate({ 
    path: 'questions',
    options: { sort: { createdAt: -1 } } // sort by createdAt in descending order
  });
      content = data.questions;
      // console.log(data);
      console.log(content);
      res.render('admin/edit-verbal-question', { content: content,data: data })
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };

  const deleteEditVerbalIq = async (req, res) => {
    try {
      const examCode = req.params.id;
      const deleteId = req.query.delete;
      console.log(examCode,deleteId);
      console.log('data deleted')
      const data = await VerbalQuestion.deleteOne({ exam_code: examCode, _id: deleteId });
      const dataRef = await IqSetting.findOneAndUpdate(
        { exam_code: examCode },
        { $pull: { questions: deleteId } },
        { new: true }
      ).populate('questions');
      res.redirect(`/iq/create/verbal/${examCode}/edit`)
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };

  const saveVerbalIq = async (req, res) => {
    try {
      const {
        question_type,
        question,
        question_image,
        choice1,
        choice2,
        choice3,
        choice4,
        answer,
        explanation,
        explanation_image
      } = req.body;
      const examCode = req.params.id;
      const iqSetting = await IqSetting.findOne({ exam_code: examCode });
      // Create a new verbal question
      const newQuestion = new VerbalQuestion({
        exam_code: examCode,
        question_type: question_type,
        question: question,
        question_image: question_image,
        choice1: choice1,
        choice2: choice2,
        choice3: choice3,
        choice4: choice4,
        answer: answer,
        explanation: explanation,
        explanation_image: explanation_image
      });
  
      // Save the new question to the database
      await newQuestion.save();
  
      iqSetting.questions.push(newQuestion);
  
      // Save the IQ setting with the new question reference
      await iqSetting.save();
  
      // Get all the questions for the exam, including the new question
      const allQuestions = await VerbalQuestion.find({ exam_code: examCode });
  
      // Render the edit question page with the exam data and all the questions
      res.redirect(`/iq/create/verbal/${examCode}/edit`);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  

  const updateEditVerbalIq = async (req, res) => {
    try {
      const {
        question_type,
        question,
        question_image,
        choice1,
        choice2,
        choice3,
        choice4,
        answer,
        explanation,
        explanation_image
      } = req.body;
      // console.log(req.body);
      const examCode = req.params.id;
      const id = req.query.id;
      
     console.log('dont worry ajaxFrom');
      // Render the edit question page with the exam data and all the question
    const Question = await VerbalQuestion.findById(id);
    if (!Question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
        Question.question_type = question_type,
        Question.question = question,
        Question.question_image = question_image,
        Question.choice1 = choice1,
        Question.choice2 = choice2,
        Question.choice3 = choice3,
        Question.choice4 = choice4,
        Question.answer = answer,
        Question.explanation = explanation,
        Question.explanation_image = explanation_image
    console.log(Question)
    await Question.save();
    res.json({ value: Question });
      
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  




























  const getCreateNonVerbalIq = async (req, res) => {
    try {
     
     
      let data = await IqSetting.find({exam_type: "nonverbal"}, null, { sort: { exam_code: -1 } });
    
      data = data.map(({ _id,exam_type,exam_code,exam_name,status,add_iq,createdAt,questions }) => ({
        _id,
        exam_type,
        exam_code,
        exam_name,
        status,
        add_iq,
        createdAt,
        questions_length: questions ? questions.length : 0
      }));
      console.log(data);
      res.render('admin/createiqlist', { content: data,title: "nonverbal" });
  
     } catch (error) {
     console.log(error.message);
    }};
  
    const createNonVerbalIq = async (req, res) => {
      try {
        console.log(req.body);
        const lastExam = await IqSetting.findOne().sort({ exam_code: -1 }).exec();
        if (!lastExam) {
          // Handle the case where there are no exam records in the database
          console.log('No exam records found');
          return res.status(404).send('No exam records found');
        }
        console.log(lastExam);
        const lastCreatedExam = lastExam.exam_code + 2;
        console.log(lastCreatedExam);
    
        // Create a new verbal IQ record using the last created exam code
        const verbalIq = new IqSetting({
          exam_type: "nonverbal",
          exam_name: req.body.exam_name,
          exam_code: lastCreatedExam,
          // add other properties from req.body as needed
        });
        console.log(verbalIq)
    
        // Save the new verbal IQ record to the database
        const savedVerbalIq = await verbalIq.save();
    
        // Send a success response to the client
        res.redirect(`/iq/create/${lastCreatedExam}/settings`);
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      }
    };
    
  

  
  
    const getEditNonVerbalIq = async (req, res) => {
      try {
        const examCode = req.params.id;
        console.log(examCode)
        const data = await IqSetting.findOne({ exam_code: examCode })
    .populate({ 
      path: 'questions',
      options: { sort: { createdAt: -1 } } // sort by createdAt in descending order
    });
        content = data.questions;
        console.log(data);
        console.log(content);
        res.render('admin/edit-non-verbal-question', { content: content,data: data })
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      }
    };
  
    const deleteEditNonVerbalIq = async (req, res) => {
      try {
        const examCode = req.params.id;
        const deleteId = req.query.delete;
        console.log(examCode,deleteId);
        console.log('data deleted')
        const data = await VerbalQuestion.deleteOne({ exam_code: examCode, _id: deleteId });
        const dataRef = await IqSetting.findOneAndUpdate(
          { exam_code: examCode },
          { $pull: { questions: deleteId } },
          { new: true }
        ).populate('questions');
        res.redirect(`/iq/create/nonverbal/${examCode}/edit`)
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      }
    };
  
    const saveNonVerbalIq = async (req, res) => {
      try {
        const {
          question_type,
          question,
          question_image,
          choice1,
          choice2,
          choice3,
          choice4,
          choice5,
          choice6,
          answer,
          explanation,
          explanation_extra,
          explanation_image
        } = req.body;
        const examCode = req.params.id;
        const iqSetting = await IqSetting.findOne({ exam_code: examCode });
        // Create a new verbal question
        const newQuestion = new VerbalQuestion({
          exam_code: examCode,
          question_type: question_type,
          question: question,
          question_image: question_image,
          choice1: choice1,
          choice2: choice2,
          choice3: choice3,
          choice4: choice4,
          choice5: choice5,
          choice6: choice6,
          answer: answer,
          explanation: explanation,
          explanation_extra: explanation_extra,
          explanation_image: explanation_image
        });
    
        // Save the new question to the database
        await newQuestion.save();
    
        iqSetting.questions.push(newQuestion);
    
        // Save the IQ setting with the new question reference
        await iqSetting.save();
    
        // Get all the questions for the exam, including the new question
        const allQuestions = await VerbalQuestion.find({ exam_code: examCode });
    
        // Render the edit question page with the exam data and all the questions
        res.redirect(`/iq/create/${iqSetting.exam_type}/${examCode}/edit`);
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      }
    };
    
  
    const updateEditNonVerbalIq = async (req, res) => {
      try {
        const {
          question_type,
          question,
          question_image,
          choice1,
          choice2,
          choice3,
          choice4,
          choice5,
          choice6,
          answer,
          explanation,
          explanation_extra,
          explanation_image
        } = req.body;
        console.log(req.body);
        const examCode = req.params.id;
        const id = req.query.id;
        
       console.log('dont worry ajaxFrom');
        // Render the edit question page with the exam data and all the question
      const Question = await VerbalQuestion.findById(id);
      if (!Question) {
        return res.status(404).json({ success: false, message: 'Question not found' });
      }
          Question.question_type = question_type,
          Question.question = question,
          Question.question_image = question_image,
          Question.choice1 = choice1,
          Question.choice2 = choice2,
          Question.choice3 = choice3,
          Question.choice4 = choice4,
          Question.choice5 = choice5,
          Question.choice6 = choice6,
          Question.answer = answer,
          Question.explanation = explanation,
          Question.explanation_extra = explanation_extra,
          Question.explanation_image = explanation_image
      console.log(Question)
      await Question.save();
      res.json({ value: Question });
        
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      }
    };
    
  
  
  
    









module.exports = {
  settingsIq,
  updateSettings,

  getCreateVerbalIq,   //verbal routes
  createVerbalIq,
  saveVerbalIq,
  getEditVerbalIq,
  deleteIq,
  deleteEditVerbalIq,
  updateEditVerbalIq,

  getCreateNonVerbalIq,  //nonverbal routes
  createNonVerbalIq,
  saveNonVerbalIq,
  getEditNonVerbalIq,
  deleteEditNonVerbalIq,
  updateEditNonVerbalIq,
};




