const express = require ("express");
const { ExamSetting,Question,Doubt,UserResult } = require('../models/examModel');
const { VideoContent,Ppdtorstory,TextContent } = require('../models/subAdminModel');
const {User} = require("../models/userModel");

const getLessonVideo = async (req, res) => {
  try {
    const type = req.query.type;


    res.render('issb/lessonvideo',{content: type});
    } 
    catch (error) {
   console.log(error.message);
  }};

  const getPracticePpdt = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // current page, default to 1
      const perPage = 10; // number of users per page
      const type = req.query.type; // ppdt
      const text_type = req.query.text_type; // bangla or english or both
  
      const query = { exam_type: "ISSB", subject: type };
  
      // Add the condition for text_type only if it's provided and not an empty string
      if (text_type !== undefined && text_type !== '') {
        query.version = text_type;
      }
  
      const count = await Question.countDocuments(query); // Count total documents
      const totalPages = Math.ceil(count / perPage); // Calculate total pages
  
      console.log(page, perPage, type, text_type, count, totalPages);
  
      const data = await Question.find(query)
        .sort({ order: 1 }) // Sort by order
        .skip((page - 1) * perPage) // Skip documents
        .limit(perPage); // Limit number of documents per page
  
      console.log(data);
  
      // Dynamically determine the render link based on the 'type' variable
      let renderLink;
      if (type === 'Picture Story' || type === 'PPDT' || type === 'Incomplete Story') {
        renderLink = 'issb/practiceppdt';
      } else {
        renderLink = 'issb/card_content';
      }
  
      // Render the page using the dynamically determined link
      res.render(renderLink, {
        content: data,
        title: type,
        currentPage: page,
        totalPages: totalPages,
        type: type,
        text_type: text_type || '' // Provide a default value if text_type is undefined
      });
    } catch (error) {
      console.log(error.message);
    }
  };
   
    const getCardContentDetails = async (req, res) => {
      try {

        const type = req.query.type;
        const id = req.query.id;
    
    
        const data = await Question.findOne({exam_type:"ISSB" , _id:id })
        console.log(data)
        res.render('issb/card_content_details', {
          content: data,
          title: type,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    



    const getIqList = async (req, res) => {
      try {
       
       
        let data = await ExamSetting.find({}, null, { sort: { exam_code: -1 } });
      
        data = data.map(({ _id,exam_type,exam_code,time,exam_name,instruction,questions }) => ({
          _id,
          exam_type,
          exam_code,
          exam_name,
          time,
          instruction,
          questions_length: questions ? questions.length : 0
        }));
        console.log(data);
        res.render('issb/iqlist', { content: data,title: "Verbal Exam" });
    
       } catch (error) {
       console.log(error.message);
      }};

      

      const getVerbalIqExam = async (req, res) => {
        try {
          const examCode = req.params.id;
          const userId = req.user._id;
          console.log(examCode);
          const data = await ExamSetting.findOne({ exam_code: examCode }).populate({
            path: "questions",
            options: { sort: { createdAt: -1 } },
          });
          let content = data.questions;
          
          const userDoubts = await Doubt.findOne({ user: userId });
          if(userDoubts){
          var newContent = content.map((item) => {
            const hasDoubt = userDoubts.question_ids.some(
              (doubt) => doubt.equals(item._id)
            );
            return { ...item._doc, doubt: hasDoubt ? 1 : 0 };
          });
        }else{
            newContent = content;
        }
          console.log(newContent);
      
          // Render the page inside the aggregate callback
          res.render("issb/iqexam", { content: newContent, data });
        } catch (error) {
          console.log(error.message);
        }
      };
      const postVerbalIqExamResult = async (req, res) => {
        try {
          const examId = req.params.id;
          const userId = req.user._id;
          const answers = req.body;
      
          // Fetch exam data with its questions and answers
          const data = await ExamSetting.findOne({ exam_code: examId }).populate({
            path: "questions",
            options: { sort: { createdAt: -1 } },
          });
      
          const content = data.questions;
      
          const userDoubts = await Doubt.findOne({ user: userId });
          const newContent = userDoubts
            ? content.map((item) => {
                const hasDoubt = userDoubts.question_ids.some(
                  (doubt) => doubt.equals(item._id)
                );
                return { ...item._doc, doubt: hasDoubt ? 1 : 0 };
              })
            : content;
      
          const mappedContent = newContent.map((question) => ({
            _id: question._id,
            exam_code: question.exam_code,
            question: question.question,
            option: question.option,
            answer: question.answer,
            explanation: question.explanation,
            doubts_count: question.doubts_count,
            createdAt: question.createdAt,
            your_answer: null, // initialize your_answer to null
            doubt: question.doubt,
          }));
      
          // Fetch all answers from the database
          const answerIds = mappedContent.map((q) => q._id);
          const allAnswers = await Question.find(
            { _id: { $in: answerIds } },
            "answer"
          );
      
          const result = {};
          const userResponses = [];
      
          mappedContent.forEach((mappedQuestion) => {
            const dbAnswer = allAnswers.find(
              (answer) => answer._id.toString() === mappedQuestion._id.toString()
            );
      
            const userAnswer = answers[mappedQuestion._id];
            const questionId = mappedQuestion._id;
      
            if (userAnswer === "0") {
              result[questionId] = "skip";
              mappedQuestion.your_answer = "0";
              userResponses.push({
                questionId,
                userAnswer: -1,
              });
            } else {
              if (dbAnswer) {
                const isRight = dbAnswer.answer === userAnswer;
                result[questionId] = isRight ? "right" : "wrong";
                mappedQuestion.your_answer = userAnswer;
                userResponses.push({
                  questionId,
                  userAnswer: isRight ? 1 : 0,
                });
              } else {
                result[questionId] = "wrong";
              }
            }
          });
      
          const count = Object.values(result).reduce((acc, value) => {
            acc[value]++;
            return acc;
          }, { right: 0, wrong: 0, skip: 0 });
      
          const totalMarks = count.right; // You may need to calculate the total marks here
      
          const userResult = new UserResult({
            name: req.user.name,
            phone: req.user.phone,
            startTime: new Date(),
            endTime: new Date(),
            marks: totalMarks,
            percentage: 100, // Calculate the percentage
            questions: userResponses,
          });
      
          await userResult.save(); // Save the user result to the database
      
          res.render("issb/iqresult", { content: mappedContent, count, data });
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Error saving doubt");
        }
      };
      
      
      const postDoubt = async (req, res) => {
  try {
    const examId = req.params.id;
    const questionId = req.query.id;
    const userId = req.user._id;

    // Find the relevant question and user
    const question = await Question.findOne({ _id: questionId });

    // Find existing doubts for the user
    const existingDoubt = await Doubt.findOne({ user: userId });

    console.log(existingDoubt);

    if (!existingDoubt) {
      // If the user has no doubts, create a new Doubt document
      const newDoubt = new Doubt({
        user: userId,
        question_ids: [questionId], // Use 'question_ids' instead of 'question_id'
      });
      question.doubts_count += 1;
      await newDoubt.save();
    } else {
      const questionIndex = existingDoubt.question_ids.indexOf(questionId); // Use 'question_ids' here

      if (questionIndex > -1) {
        // If the question is already saved, then remove it
        existingDoubt.question_ids.splice(questionIndex, 1); // Use 'question_ids' here
        question.doubts_count -= 1;
      } else {
        // If the question is not saved, then push it
        existingDoubt.question_ids.push(questionId); // Use 'question_ids' here
        question.doubts_count += 1;
      }
      await existingDoubt.save();
    }

    await question.save();

    res.redirect(`/issb/verbal/${examId}/exam`);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error saving doubt');
  }
};

      

  
             
        
    
  
  



        
        // issb/www.google.com/2058/practice

    //     const examCode = req.params.id;
    //     console.log(examCode)
    //     const data = await IqSetting.findOne({ exam_code: examCode })
    // .populate({ 
    //   path: 'questions',
    //   options: { sort: { createdAt: -1 } } // sort by createdAt in descending order
    // });
    //     content = data.questions;
    //     // console.log(data);
    //     // console.log(content);
    //     res.render('admin/edit-verbal-question', { content: content,data: data })
module.exports = {
  getLessonVideo,
  getPracticePpdt,
  getCardContentDetails,
  getIqList,
  getVerbalIqExam,
  postDoubt,
  postVerbalIqExamResult,
};



  
