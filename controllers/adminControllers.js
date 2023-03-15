const express = require ("express");
const { Ppdtorstory, PlanningContent, VideoContent, TextContent } = require('../models/subAdminModel');
const ejs = require('ejs');



const dashboard = async (req, res) => {
  try {
    res.render('admin/dashboard');
    } 
    catch (error) {
   console.log(error.message);
  }};







// ppdt and story create read and update delete

const createPpdtorstory = async (req, res) => {
  try {
    const { type, image, solve, hint } = req.body;

    const newPpdtorstory = new Ppdtorstory({ type, image, solve, hint });
    await newPpdtorstory.save();

    res.redirect ('/admin/editppdt');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create new ppdtorstory" });
  }
};

const readPpdtorstory = async (req, res) => {
  try {
    const ppdtorstoryList = await Ppdtorstory.find().sort({ _id: -1 });
    console.log(ppdtorstoryList);
    res.render('admin/edit-ppdt',{ data: ppdtorstoryList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve ppdtorstory list" });
  }
};

const readPpdtorstorybytype = async (req, res) => {
  try {
    const selectedType = req.query.type;
    let filter = {};
    if (selectedType !== "") {
      filter = { type: selectedType };
    }
    const ppdtorstoryList = await Ppdtorstory.find(filter).sort('order');
    const value = `
    <% data.forEach(function(content) { %>
      <form action="/admin/updateppdt" method="post" class="ajaxFrom" id="id_<%= content._id %>">
        
        <div class="addquestion"> 
          <input type="text" name="id" value="<%= content._id %>" hidden> 
          <div class="ques-exp">
            <select name="type">
              <option value="PPDT" <%= content.type === "PPDT" ? "selected" : "" %>>PPDT</option>
              <option value="Picture Story" <%= content.type === "Picture Story" ? "selected" : "" %>>Picture Story</option>
            </select>
            
            
          </div>
          <div class="ques-exp">  
            <input name="image" type="text" class="imagelink1"  placeholder="Image" value="<%= content.image %>" >
          </div>
          <div class="image-container1"></div>
          <div class="ques-exp">
            <textarea name="solve"  placeholder="write Solve here..." ><%= content.solve %></textarea>
          </div>
          <div class="ques-exp">  
            <input name="hint" type="text" placeholder="write hints here..." value="<%= content.hint %>" >
          </div>
          <div class="buttons">
          <input type="submit" value="Update" class="button"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button class="button show-modal" id="<%= content._id %>">Delete</button>
        </div>
        </div>
        <div class="message"></div>
        
      </form>  
      <% }) %>  
  `;
  const html = ejs.render(value, { data: ppdtorstoryList });
    res.status(200).json({ data: html });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve ppdtorstory list" });
  }
};

const orderPpdtorstory = async (req, res) => {
  try {
    const ids = req.body['id'];
    console.log(ids);
    for (let i=0; i<ids.length; i++){
      console.log(ids[i]);
      const id = ids[i];
      const ppdtorstoryList = await Ppdtorstory.findById(id);
      ppdtorstoryList.order=i;
      await ppdtorstoryList.save();
    }
    res.status(200).json({ success: true, message: "Ppdtorstory list order updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update ppdtorstory list order" });
  }

};




const updatePpdtorstory = async (req, res) => {
  try {
    const { id, type, image, solve, hint } = req.body;
    console.log(req.body);
    const ppdtorstory = await Ppdtorstory.findById(id);
    if (!ppdtorstory) {
      return res.status(404).json({ success: false, message: 'Ppdtorstory not found' });
    }

    ppdtorstory.type = type;
    ppdtorstory.image = image;
    ppdtorstory.solve = solve;
    ppdtorstory.hint = hint;
    await ppdtorstory.save();
    res.json({ value: ppdtorstory });
    // res.redirect('/admin/editppdt');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update ppdtorstory' });
  }
};


const deletePpdtorstory = async (req, res) => {
  try {
    const { id } = req.params;

    const ppdtorstory = await Ppdtorstory.findById(id);
    if (!ppdtorstory) {
      return res.status(404).json({ success: false, message: 'Ppdtorstory not found' });
    }

    await ppdtorstory.remove();

    res.redirect('/admin/editppdt');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete ppdtorstory' });
  }
};





// videoContent create read and update delete


const createVideoContent = async (req, res) => {
  try {
    const { type, title,video_link } = req.body;

    const newVideoContent = new VideoContent({ type, title,video_link });
    await newVideoContent.save();

    res.redirect ('/admin/videocontent');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create new VideoContent" });
  }
};

const readVideoContent = async (req, res) => {
  try {
    const VideoContentList = await VideoContent.find().sort({ _id: -1 });
    console.log(VideoContentList);
    res.render('admin/video-content',{ data: VideoContentList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve VideoContent list" });
  }
};

const readVideoContentbytype = async (req, res) => {
  try {
    const selectedType = req.query.type;
    let filter = {};
    if (selectedType !== "") {
      filter = { type: selectedType };
    }
    const VideoContentList = await VideoContent.find(filter).sort('order');
    const value = `
    <% if (data && data.length) { %>
      <% data.forEach(function(content) { %>
      <form action="/admin/updatevideocontent" method="post" class="ajaxFrom" id="id_<%= content._id %>">
         <div class="addquestion">
            <div class="ques-exp">
               <select name="type">
                  <option value="iq_verbal" <%= content.type === "iq_verbal" ? "selected" : "" %>>Iq verbal</option>
                  <option value="iq_nonverbal" <%= content.type === "iq_nonverbal" ? "selected" : "" %>>Iq Non verbal</option>
                  <option value="ppdt" <%= content.type === "ppdt" ? "selected" : "" %>>PPDT</option>
                  <option value="essay_writing" <%= content.type === "essay_writing" ? "selected" : "" %>>Essay Writing</option>
                  <option value="incompleting_story" <%= content.type === "incompleting_story" ? "selected" : "" %>>Incompleting Story</option>
                  <option value="story_from_picture" <%= content.type === "story_from_picture" ? "selected" : "" %>>Story from picture</option>
                  <option value="incompleting_sentences" <%= content.type === "incompleting_sentences" ? "selected" : "" %>>Incompleting Sentences</option>
                  <option value="wat" <%= content.type === "wat" ? "selected" : "" %>>WAT</option>
                  <option value="memorable_and_bitter" <%= content.type === "memorable_and_bitter" ? "selected" : "" %>>Memorable and Bitter</option>
                  <option value="self_criticism" <%= content.type === "self_criticism" ? "selected" : "" %>>Self Criticism</option>
                  <option value="self_assessment" <%= content.type === "self_assessment" ? "selected" : "" %>>Self Assessment</option>
                  <option value="group_discussion" <%= content.type === "group_discussion" ? "selected" : "" %>>Group Discussion</option>
                  <option value="pgt" <%= content.type === "pgt" ? "selected" : "" %>>PGT</option>
                  <option value="hgt" <%= content.type === "hgt" ? "selected" : "" %>>HGT</option>
                  <option value="extemphore" <%= content.type === "extemphore" ? "selected" : "" %>>Extemphore</option>
                  <option value="pat" <%= content.type === "pat" ? "selected" : "" %>>PAT</option>
                  <option value="dp" <%= content.type === "dp" ? "selected" : "" %>>DP</option>
                  <option value="planning_exercise" <%= content.type === "planning_exercise" ? "selected" : "" %>>Planning Exercise</option>
                  <option value="gto_viva" <%= content.type === "gto_viva" ? "selected" : "" %>>GTO Viva</option>
                  <option value="command_task" <%= content.type === "command_task" ? "selected" : "" %>>Command Task</option>
                  <option value="psychometrics" <%= content.type === "psychometrics" ? "selected" : "" %>>Psychometrics</option>
               </select>
            </div>
            <div class="ques-exp">
               <input type="text" name="title" placeholder="Video Title..." value="<%= content.title %>">
            </div>
            <div class="ques-exp">
               <input type="text" name="video_link" placeholder="Video Link..." value="<%= content.video_link %>">
            </div>
            <div class="buttons">
               <input type="submit" value="Update" class="button"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <button class="button show-modal" id="<%= content._id %>">Delete</button>
            </div>
            <div class="message"></div>
         </div>   
      </form>
      <% }) %>           
      <% } else { %>
      <p>No video content found.</p>
      <% } %>
  `;
  const html = ejs.render(value, { data: VideoContentList });
    res.status(200).json({ data: html });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve VideoContent list" });
  }
};

const orderVideoContent = async (req, res) => {
  try {
    const ids = req.body['id'];
    console.log(ids);
    for (let i=0; i<ids.length; i++){
      console.log(ids[i]);
      const id = ids[i];
      const VideoContentList = await VideoContent.findById(id);
      VideoContentList.order=i;
      await VideoContentList.save();
    }
    res.status(200).json({ success: true, message: "VideoContent list order updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update VideoContent list order" });
  }

};




const updateVideoContent = async (req, res) => {
  try {
    const { id, type,title, video_link } = req.body;
    console.log(req.body);
    const updateVideoContentData = await VideoContent.findById(id);
    if (!updateVideoContentData) {
      return res.status(404).json({ success: false, message: 'VideoContent not found' });
    }

    updateVideoContentData.type = type;
    updateVideoContentData.title = title;
    updateVideoContentData.video_link = video_link;
    console.log(updateVideoContentData)
    await updateVideoContentData.save();
    res.json({ value: updateVideoContentData });
    // res.redirect('/admin/editppdt');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update VideoContent. Please try again later.' });
  }
};



const deleteVideoContent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideoContent = await VideoContent.findById(id);
    if (!deletedVideoContent) {
      return res.status(404).json({ success: false, message: 'VideoContent not found' });
    }

    await deletedVideoContent.remove();

    res.redirect('/admin/videocontent');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete VideoContent' });
  }
};










// TextContent create read and update delete



const createTextContent = async (req, res) => {
  try {
    const { type, text_type,title,solve,hint } = req.body;
    console.log(req.body);

    const newTextContent = new TextContent({ type, title,text_type,solve,hint });
    await newTextContent.save();

    res.redirect ('/admin/textcontent');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create new TextContent" });
  }
};

const readTextContent = async (req, res) => {
  try {
    const textContentList = await TextContent.find().sort({ _id: -1 });
    console.log(textContentList);
    res.render('admin/text-content', { data: textContentList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve text content list. Please try again later." });
  }
};


const readTextContentbytype = async (req, res) => {
  try {
    const selectedType = req.query.type;
    let filter = {};
    if (selectedType !== "") {
      filter = { type: selectedType };
    }
    const TextContentList = await TextContent.find(filter).sort('order');
    const value = `
    <% if (data && data.length) { %>
      <% data.forEach(function(content) { %>
      <form action="/admin/updatetextcontent" method="post" class="ajaxFrom" id="id_<%= content._id %>">
         <div class="addquestion">
            <div class="ques-exp">
               <select name="type">
                  <option value="iq_verbal" <%= content.type === "iq_verbal" ? "selected" : "" %>>Iq verbal</option>
                  <option value="iq_nonverbal" <%= content.type === "iq_nonverbal" ? "selected" : "" %>>Iq Non verbal</option>
                  <option value="ppdt" <%= content.type === "ppdt" ? "selected" : "" %>>PPDT</option>
                  <option value="essay_writing" <%= content.type === "essay_writing" ? "selected" : "" %>>Essay Writing</option>
                  <option value="incompleting_story" <%= content.type === "incompleting_story" ? "selected" : "" %>>Incompleting Story</option>
                  <option value="story_from_picture" <%= content.type === "story_from_picture" ? "selected" : "" %>>Story from picture</option>
                  <option value="incompleting_sentences" <%= content.type === "incompleting_sentences" ? "selected" : "" %>>Incompleting Sentences</option>
                  <option value="wat" <%= content.type === "wat" ? "selected" : "" %>>WAT</option>
                  <option value="memorable_and_bitter" <%= content.type === "memorable_and_bitter" ? "selected" : "" %>>Memorable and Bitter</option>
                  <option value="self_criticism" <%= content.type === "self_criticism" ? "selected" : "" %>>Self Criticism</option>
                  <option value="self_assessment" <%= content.type === "self_assessment" ? "selected" : "" %>>Self Assessment</option>
                  <option value="group_discussion" <%= content.type === "group_discussion" ? "selected" : "" %>>Group Discussion</option>
                  <option value="pgt" <%= content.type === "pgt" ? "selected" : "" %>>PGT</option>
                  <option value="hgt" <%= content.type === "hgt" ? "selected" : "" %>>HGT</option>
                  <option value="extemphore" <%= content.type === "extemphore" ? "selected" : "" %>>Extemphore</option>
                  <option value="pat" <%= content.type === "pat" ? "selected" : "" %>>PAT</option>
                  <option value="dp" <%= content.type === "dp" ? "selected" : "" %>>DP</option>
                  <option value="planning_exercise" <%= content.type === "planning_exercise" ? "selected" : "" %>>Planning Exercise</option>
                  <option value="gto_viva" <%= content.type === "gto_viva" ? "selected" : "" %>>GTO Viva</option>
                  <option value="command_task" <%= content.type === "command_task" ? "selected" : "" %>>Command Task</option>
                  <option value="psychometrics" <%= content.type === "psychometrics" ? "selected" : "" %>>Psychometrics</option>
               </select>
            </div>
            <div class="ques-exp">
               <input type="text" name="title" placeholder="Video Title..." value="<%= content.title %>">
            </div>
            <div class="ques-exp">
               <input type="text" name="video_link" placeholder="Video Link..." value="<%= content.video_link %>">
            </div>
            <div class="buttons">
               <input type="submit" value="Update" class="button"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <button class="button show-modal" id="<%= content._id %>">Delete</button>
            </div>
            <div class="message"></div>
         </div>   
      </form>
      <% }) %>           
      <% } else { %>
      <p>No video content found.</p>
      <% } %>
  `;
  const html = ejs.render(value, { data: TextContentList });
    res.status(200).json({ data: html });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve TextContent list" });
  }
};

const orderTextContent = async (req, res) => {
  try {
    const ids = req.body['id'];
    console.log(ids);
    for (let i=0; i<ids.length; i++){
      console.log(ids[i]);
      const id = ids[i];
      const TextContentList = await TextContent.findById(id);
      TextContentList.order=i;
      await TextContentList.save();
    }
    res.status(200).json({ success: true, message: "TextContent list order updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update TextContent list order" });
  }

};




const updateTextContent = async (req, res) => {
  try {
    const { id, type,title, hint,solve } = req.body;
    console.log(req.body);
    const updateTextContentData = await TextContent.findById(id);
    if (!updateTextContentData) {
      return res.status(404).json({ success: false, message: 'TextContent not found' });
    }

    updateTextContentData.type = type;
    updateTextContentData.title = title;
    updateTextContentData.solve = solve ;
    updateTextContentData.hint = hint ;
    console.log(updateTextContentData);
    await updateTextContentData.save();
    res.json({ value: updateTextContentData });
    // res.redirect('/admin/editppdt');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update TextContent. Please try again later.' });
  }
};



const deleteTextContent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTextContent = await TextContent.findById(id);
    if (!deletedTextContent) {
      return res.status(404).json({ success: false, message: 'TextContent not found' });
    }

    await deletedTextContent.remove();

    res.redirect('/admin/textcontent');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete TextContent' });
  }
};









// Planning Test create read and update delete

const createPlanningContent = async (req, res) => {
  try {
    const { title,image,content_text,written,discussion } = req.body;
    console.log(req.body);
    const newPlanningContent = new PlanningContent({ title,image,content_text,written,discussion });
    await newPlanningContent.save();

    res.redirect ('/admin/planningcontent');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create new PlanningContent" });
  }
};

const readPlanningContent = async (req, res) => {
  try {
    const planningContentList = await PlanningContent.find().sort({ _id: -1 });
    console.log(planningContentList);
    res.render('admin/edit-planning-excercise', {data: planningContentList} );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve Planning content list. Please try again later." });
  }
};


const updatePlanningContent = async (req, res) => {
  try {
    const { title,image,content_text,written,discussion } = req.body;
    console.log(req.body);
    const updatePlanningContentData = await PlanningContent.findById(id);
    if (!updatePlanningContentData) {
      return res.status(404).json({ success: false, message: 'PlanningContent not found' });
    }

    updatePlanningContentData.title = title;
    updatePlanningContentData.image = image;
    updatePlanningContentData.content_text = content_text ;
    updatePlanningContentData.written = written ;
    updatePlanningContentData.discussion = discussion ;
    console.log(updatePlanningContentData);
    await updatePlanningContentData.save();
    res.json({ value: updatePlanningContentData });
    // res.redirect('/admin/editppdt');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update PlanningContent. Please try again later.' });
  }
};


const deletePlanningContent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlanningContent = await PlanningContent.findById(id);
    if (!deletedPlanningContent) {
      return res.status(404).json({ success: false, message: 'PlanningContent not found' });
    }

    await deletedPlanningContent.remove();

    res.redirect('/admin/Planningcontent');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete TextContent' });
  }
};


module.exports = {
 dashboard,
 createPpdtorstory, //ppdt and story items
 readPpdtorstory,
 readPpdtorstorybytype,
 orderPpdtorstory,
 updatePpdtorstory,
 deletePpdtorstory,
 createVideoContent, //video content 
 readVideoContent,
 readVideoContentbytype,
 orderVideoContent,
 updateVideoContent,
 deleteVideoContent,
 createTextContent, //Text content 
 readTextContent,
 readTextContentbytype,
 orderTextContent,
 updateTextContent,
 deleteTextContent,
 createPlanningContent, //Planning Content
 readPlanningContent,
 updatePlanningContent,
 deletePlanningContent,

};




