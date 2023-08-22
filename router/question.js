
const express = require('express');
const jwt = require('jsonwebtoken');
const Question = require('../models/Question');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetch_id = require('../middleware/fetch_id');
const { exists } = require('../models/Job');
// Route 3 to fetch the user
router.get('/fetchquestion', fetch_id, async (req, res) => {
  // res.set({
  //   'Content-Type':'application/json',
  //   'Access-Control-Allow-Origin':'https://notes-app.000.pe/',
  //   'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
  // })
  try {
    const userId = req.user;
    let user = await User.findById(userId).select("-password");
    if (user.role != 'admin')
      return res.status(401).send("not allowed");
    let question = await Question.find({adminId:userId});
    res.json(question );
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Intenal Server Error");
  }

})

router.post('/addquestion', fetch_id, [
  body('title', 'Enter a valid String').exists(),
  body('description', 'Enter a valid email').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userId = req.user;
    let user = await User.findById(userId).select("-password");
    if (user.role === "admin") {
      const { title, description } = req.body;
      uniqueQ = await Question.find({ title: { $regex: title } });
      if (!uniqueQ[0]) {
        const question = await new Question({ title, description, adminId: userId }).save();
        res.json(question);
      }
      else
        return res.status(400).json({ error: "Question is already added" });
    }
    else
      return res.status(400).json({ error: "Only admin can add the question" });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Intenal Server Error");
  }

})
router.post('/deletequestion', fetch_id, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let question = await Question.findById(req.params.id);

    if (!question)
      return res.status(404).send("Not found");

    if (question.adminId.toString() !== req.user)
      return res.status(401).send("not allowed");

    question = await Question.findByIdAndDelete(req.params.id);
    res.json({ question });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Intenal Server Error");
  }

})
router.put('/updatequestion/:id', fetch_id, async (req, res) => {
  const { title, description, testCases } = req.body;

  try {
    const newQuestion = {};
    if (title)
      newQuestion.title = title;
    if (description)
      newQuestion.description = description;
    if (testCases)
      newQuestion.testCases = testCases;

    let question = await Question.findById(req.params.id);

    if (!question)
      return res.status(404).send("Not found");

    if (question.adminId.toString() !== req.user)
      return res.status(401).send("not allowed");

    uniqueTitle = await Question.find({ title: { $regex: /^title$/ } });
    if (uniqueTitle[0])
      return res.status(401).send("Question is already present with same title");

    question = await Question.findByIdAndUpdate(req.params.id, { $set: newQuestion }, { new: true });
    res.json({ question });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Intenal Server Error");
  }

})
router.delete('/deletequestion/:id', fetch_id, async (req, res) => {
  const { title, description, testCases } = req.body;

  try {
    let question = await Question.findById(req.params.id);

    if (!question)
      return res.status(404).send("Not found");

    if (question.adminId.toString() !== req.user)
      return res.status(401).send("not allowed");

    question = await Question.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Question has been deleted", question: question });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Intenal Server Error");
  }
})

module.exports = router;