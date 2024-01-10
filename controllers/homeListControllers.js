const express = require ("express");
const { ExamSetting,Question,Doubt,UserResult } = require('../models/examModel');
const {User} = require("../models/userModel");
const path = require('path');
const fs = require('fs/promises');  // Use fs.promises for promise-based file operations


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
        
        const text_type = req.query.text_type;
        const id = req.query.id;
    
    
        const data = await Question.findOne({exam_type:"ISSB" , _id:id })
        console.log(data)
        res.render('issb/card_content_details', {
          content: data,
          title: type,
          text_type: text_type,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    

    const getIncomSen = async (req, res) => {
      try {
        const type = req.query.type;
        const text_type = req.query.text_type;
        const practice_type = req.query.practice_type;
        console.log(type, text_type, practice_type);
    
        let jsonFileName = 'incom_sentences.json'; // Default JSON file name
    
        if (practice_type && practice_type.toUpperCase() === 'WAT') {
          jsonFileName = 'wat.json'; // Change the JSON file for WAT type
        }
    
        const jsonFilePath = path.join(__dirname, '..', 'public', 'assets', jsonFileName);
    
        const jsonData = await fs.readFile(jsonFilePath, 'utf8');
    
        // Parse the JSON data
        let data = JSON.parse(jsonData);
    
        if (practice_type === 'Incomplete Sentences') {
          data = data[text_type][type];
          console.log(data)
          res.render('issb/incompleting_sentences', {
            data: data,
            title: type,
          });
        } else if (practice_type === 'WAT') {
          data = data[text_type][type];
          console.log(data)
          res.render('issb/wat_test', {
            data: data,
            title: type,
          });
        } else {
          // Handle other practice types or provide a default behavior
          res.send('Invalid practice type');
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    
    
    const getIncomSenList = async (req, res) => {
      try {
        const type = req.query.type;
        const text_type = req.query.text_type;
        const practice_type = type;
        console.log(type, text_type,practice_type);
    
        let jsonFileName = 'incom_sentences.json'; // Default JSON file name
    
        if (type && type.toUpperCase() === 'WAT') {
          jsonFileName = 'wat.json'; // Change the JSON file for WAT type
        }
    
        const jsonFilePath = path.join(__dirname, '..', 'public', 'assets', jsonFileName);
    
        const jsonData = await fs.readFile(jsonFilePath, 'utf8');
    
        // Parse the JSON data
        const data = JSON.parse(jsonData);
    
        console.log(data);
        res.render('issb/wat&incomsenlist', {

          data: data,
          title: type,
          text_type,
          practice_type,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    
    const getIqList = async (req, res) => {
      try {
       
       const title = req.query.title;
       let time, examMarks;

if (title === "Verbal Test") {
    time = 60;
    examMarks = 100;
} else if (title === "Non-Verbal Test") {
    time = 12;
    examMarks = 38;
} else {
    // Handle other cases or provide default values
    time = 0;
    examMarks = 0;
}
       
       let jsonFileName = 'iq_test.json'; // Default JSON file name
    
   
       const jsonFilePath = path.join(__dirname, '..', 'public', 'assets', jsonFileName);
   
       const jsonData = await fs.readFile(jsonFilePath, 'utf8');
   
       // Parse the JSON data
       const data = JSON.parse(jsonData)[title];
   
       console.log(data);
       
        res.render('issb/iqlist', { content: data,title,time,examMarks });
    
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
            options: { sort: { order: -1 } },
          });
          let content = data.questions;
          
          const userDoubts = await Doubt.findOne({ user: userId });
          const newContent = content.map((item) => {
            const hasDoubt = userDoubts?.question_ids.some((doubt) => doubt.equals(item._id));
            return { ...item._doc, doubt: hasDoubt ? 1 : 0 };
          });
          
          console.log(newContent);
      
          // Render the page inside the aggregate callback
          res.render("issb/iqexam", { content: newContent, data });
        } catch (error) {
          console.log(error.message);
        }
      };

      const getVerbalIqPractice = async (req, res) => {
        try {
          const examCode = req.params.id;
          const userId = req.user._id;
          console.log(examCode);
          const data = await ExamSetting.findOne({ exam_code: examCode }).populate({
            path: "questions",
            options: { sort: { order: -1 } },
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
          res.render("issb/iq-practice", { content: newContent, data });
        } catch (error) {
          console.log(error.message);
        }
      };


      const postVerbalIqExamResult = async (req, res) => {
        try {
            const examId = req.params.id;
            const userId = req.user._id;
            const answers = req.body;
            const timeTaken = req.body["started-time"];
    
            // Fetch all questions and answers in one query
            const content = await ExamSetting.findOne({ exam_code: examId })
                .populate({
                    path: "questions",
                    options: { sort: { order: -1 } },
                })
                .select("questions")
                .lean();
    
            const userDoubts = await Doubt.findOne({ user: userId });
    
            // Combine question data with doubt information
            const mappedContent = content.questions.map((item) => {
                const hasDoubt = userDoubts ? userDoubts.question_ids.some((doubt) => doubt.equals(item._id)) : false;
                return { ...item, doubt: hasDoubt ? 1 : 0, your_answer: null };
            });
    
            // Fetch all answers in one query
            const answerIds = mappedContent.map((q) => q._id);
            const allAnswers = await Question.find({ _id: { $in: answerIds } }, "answer").lean();
    
            const result = {};
            const userResponses = [];
    
            // Use Promise.all to parallelize asynchronous operations
            await Promise.all(mappedContent.map(async (mappedQuestion) => {
                const dbAnswer = allAnswers.find((answer) => answer._id.toString() === mappedQuestion._id.toString());
                const userAnswer = answers[mappedQuestion._id];
                const questionId = mappedQuestion._id;
    
                if (userAnswer === "0") {
                    result[questionId] = "skip";
                    mappedQuestion.your_answer = "0";
                    userResponses.push({ questionId, userAnswer: -1 });
                } else {
                    if (dbAnswer) {
                        const isRight = dbAnswer.answer === userAnswer;
                        result[questionId] = isRight ? "right" : "wrong";
                        mappedQuestion.your_answer = userAnswer;
                        userResponses.push({ questionId, userAnswer: isRight ? 1 : 0 });
                    } else {
                        result[questionId] = "wrong";
                    }
                }
            }));
    
            const { right, wrong, skipped } = Object.values(result).reduce((acc, value) => {
                acc[value]++;
                return acc;
            }, { right: 0, wrong: 0, skipped: 0 });
    
            const totalMCQ = right + wrong + skipped;
    
            // Calculate negative marking
            const negativeMarkingPercent = content.negative_marking ? 25 : 0;
            const negativeMarks = wrong * (negativeMarkingPercent / 100);
            const totalMarks = right - negativeMarks;
    
            const finalResult = {
                user_id: userId,
                name: req.user.name,
                institution: req.user.institution,
                right,
                wrong,
                totalMCQ,
                skipped,
                negativeMarks,
                totalMarks,
                timeTaken,
            };
    
            // Save the final result only if it doesn't exist for the user
            let examData = await ExamSetting.findOneAndUpdate(
                { exam_code: examId, 'user_result.user_id': { $ne: userId } },
                { $push: { user_result: finalResult } },
                { new: true }
            );
    
            // If the user_result was not updated (user already exists), retrieve the updated examData
            if (!examData) {
                examData = await ExamSetting.findOne({ exam_code: examId }).lean();
                // Use examData for rendering or further processing
            }
    
            console.log('examdataaaa', examData);
            res.render("issb/iqresult", { content: mappedContent, result, timeTaken, finalResult, examData });
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
console.log(questionId)
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

    // res.redirect(`/issb/verbal/${examId}/exam`);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error saving doubt');
  }
};

      

  
             
        
    
  

module.exports = {
  getPracticePpdt,
  getCardContentDetails,
  getIqList,
  getVerbalIqExam,
  getVerbalIqPractice,
  postDoubt,
  postVerbalIqExamResult,
  getIncomSen,
  getIncomSenList,
};


