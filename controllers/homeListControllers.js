const express = require ("express");
const { IqSetting,VerbalQuestion,Doubt } = require('../models/iqModel');
const { VideoContent,Ppdtorstory,TextContent } = require('../models/subAdminModel');

const getLessonVideo = async (req, res) => {
  try {
    const type = req.query.type;
    let data = await VideoContent.find({type: type}, null, { sort: { order: 1 } });
    console.log(data);


    res.render('issb/lessonvideo',{content:data});
    } 
    catch (error) {
   console.log(error.message);
  }};

const getPracticePpdt = async (req, res) => {
  try {
    const type = req.query.type;
    let data = await Ppdtorstory.find({type: type}, null, { sort: { order: 1 } });
    console.log(data);
    res.render('issb/practiceppdt',{content:data,title:'PPDT'});
    } 
    catch (error) {
   console.log(error.message);
  }};

  const getPictureStory = async (req, res) => {
    try {
      const type = req.query.type;
      let data = await Ppdtorstory.find({type: type}, null, { sort: { order: 1 } });
      console.log(data);
      res.render('issb/picture_story',{content:data,title: 'Picture Story'});
      } 
      catch (error) {
     console.log(error.message);
    }};



    const getTextContent = async (req, res) => {
      try {
        const type = req.query.type;
        const text_type = req.query.text_type;
        let data = await TextContent.find({type: type,text_type: text_type}, null, { sort: { order: 1 } });
        console.log(text_type);
        console.log(data);
        console.log(type)
        res.render('issb/text_content',{content:data,title: 'Picture Story'});
        } 
        catch (error) {
       console.log(error.message);
      }};
    
    
    

    const getIqList = async (req, res) => {
      try {
       
       
        let data = await IqSetting.find({exam_type: "verbal"}, null, { sort: { exam_code: -1 } });
      
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
          const data = await IqSetting.findOne({ exam_code: examCode }).populate({
            path: "questions",
            options: { sort: { createdAt: -1 } },
          });
          let content = data.questions;
          
          const userDoubts = await Doubt.findOne({ user: userId });
          if(userDoubts){
          var newContent = content.map((item) => {
            const hasDoubt = userDoubts.question_id.some(
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
          const questionId = req.query.id;
          const userId = req.user._id;
          const answers = req.body;
          console.log(answers)
          const data = await IqSetting.findOne({ exam_code: examId })
            .populate({
              path: "questions",
              options: { sort: { createdAt: -1 } },
            });
      
          const content = data.questions;

          console.log(content);
          const userDoubts = await Doubt.findOne({ user: userId });
          if(userDoubts){
          var newContent = content.map((item) => {
            const hasDoubt = userDoubts.question_id.some(
              (doubt) => doubt.equals(item._id)
            );
            return { ...item._doc, doubt: hasDoubt ? 1 : 0 };
          });
        }else{
            newContent = content;
        }
      
          const result = {};
          const mappedContent = newContent.map(question => ({
            _id: question._id,
            exam_code: question.exam_code,
            question: question.question,
            question_image: question.question_image,
            choice1: question.choice1,
            choice2: question.choice2,
            choice3: question.choice3,
            choice4: question.choice4,
            answer:  question.answer,
            explanation: question.explanation,
            explanation_image: question.explanation_image,
            doubts_count: question.doubts_count,
            createdAt: question.createdAt,
            your_answer: null, // initialize your_answer to null
            doubt: question.createdAt
          }));
      
          for (let id in answers) {
            const answer = answers[id];
            const query = { _id: id };
            let dbResult = await VerbalQuestion.findOne(query);
      
            if (answer === '0') {
              result[id] = 'skip';
              const mappedQuestion = mappedContent.find(q => q._id.toString() === id.toString());
              if (mappedQuestion) {
                mappedQuestion.your_answer = answer;
              }
            } else {
              if (dbResult) {
                result[id] = dbResult.answer === answer ? 'right' : 'wrong';
                const mappedQuestion = mappedContent.find(q => q._id.toString() === id.toString());
                if (mappedQuestion) {
                  mappedQuestion.your_answer = answer;
                }
                dbResult.your_answer = answer; // update your_answer in the database
                dbResult.save(); // save the updated IqQuestion document
              } else {
                result[id] = 'wrong';
              }
            }
          }
      
          console.log(result);
          const count = {
            right: 0,
            wrong: 0,
            skip: 0
          };
      
          for (let id in result) {
            const value = result[id];
            count[value]++;
          }

       
      
          console.log(count);
          console.log('mapper data ekhne ashbe')
          console.log(newContent);
          res.render("issb/iqresult", { content: mappedContent, count ,data});//newContent object e doubts ashtese kintu etay ashe na, ar eta dile tao result e prb hocche
        } catch (error) {
          console.log(error.message);
          res.status(500).send('Error saving doubt');
        }
      };
      

      const postDoubt = async (req, res) => {
        try {
          const examId = req.params.id;
          const questionId = req.query.id;
          const userId = req.user._id;
          const question = await VerbalQuestion.findOne({ _id: questionId });
      
          console.log(question);
          console.log('quesiton ki paisos')
      
          // Find an existing Doubt document for the user and exam
          const existingDoubt = await Doubt.findOne({ user: userId });
      
          if (existingDoubt) {
            // Check if the question is already saved
            const index = existingDoubt.question_id.findIndex((item) => item._id.equals(question._id));
            if (index > -1) {
              // If the question is already saved, then remove it
              existingDoubt.question_id.splice(index, 1);
              question.doubts_count -= 1; // Decrease doubts_count by 1
              await question.save();
            } else {
              // If the question is not saved, then push it
              existingDoubt.question_id.push(question);
              question.doubts_count += 1;
              await question.save();
           
            }
            const savedDoubt = await existingDoubt.save();
            console.log('Doubt updated successfully:', savedDoubt);
          } else {
            // Create a new Doubt document
            const newDoubt = new Doubt({
              user: userId,
              exam_id: examId,
              question_id: [question],
            });
            question.doubts_count += 1;
            await question.save();
            // Save the Doubt document to the database
            const savedDoubt = await newDoubt.save();
            // Do not modify doubts_count
            console.log('Doubt saved successfully:', savedDoubt);
          }
      
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
  getPictureStory,
  getTextContent,
  getIqList,
  getVerbalIqExam,
  postDoubt,
  postVerbalIqExamResult,
};



