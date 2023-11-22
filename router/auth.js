const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetch_id = require('../middleware/fetch_id');
const Profile = require('../models/profile');
const bcrypt = require('bcryptjs');

// route 1 to signup the user
router.post('/user', [
  body('name', 'Enter a valid String').exists(),
  body('email', 'Enter a valid email').isEmail(),
], async (req, res) => {

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const data = {
        id: user.id
      }
      var authToken = jwt.sign(data, process.env.JWT_SECRET);
      success = true;
      return res.status(200).json({ success, email: req.body.email, authToken });
    }
    // console.log(user);
    // const salt = await bcrypt.genSalt(10);
    // secPass = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
    });
    const data = {
      id: user.id
    }
    var authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    return res.status(200).json({ success, email: req.body.email, authToken });

  }
  catch (error) {
    console.error(error.message);
    return res.json(200, success, "Internal Server Error");
  }

})
router.post('/signup', [
  body('name', 'Enter a valid String').exists(),
  body('password', 'Enter a valid String').exists(),
  body('email', 'Enter a valid email').isEmail(),
], async (req, res) => {

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(403).json({ success, error: "User already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt)
    
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    });
    const data = {
      id: user.id
    }
    var authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    return res.status(200).json({ success, email: req.body.email, authToken });

  }
  catch (error) {
    console.error(error.message);
    return res.json(200, success, "Internal Server Error");
  }

})
router.post('/login', [
  body('password', 'Enter a valid String').exists(),
  body('email', 'Enter a valid email').exists()
], async (req, res) => {

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  const {email,password}=req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: "Please Login with correct credentials" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Please Login with correct credentials" });
    }
    const data = {
      id: user.id
    }
    var authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    return res.status(200).json({ success, email: req.body.email, authToken });

  }
  catch (error) {
    console.error(error.message);
    return res.json(500, success, "Internal Server Error");
  }

})
router.get('/getprofile', fetch_id, async (req, res) => {
  let success = false;
  try {
    const userId = req.user;
    let profile = await Profile.findById(userId);
    if (profile) {
      success = true;
      return res.status(200).json({ success, profile });
    }
    else
      return res.status(200).json("No profile added");

  }
  catch (error) {
    console.error(error.message);
    return res.status(500).send("No profile created");
  }
})
router.post('/addprofile', fetch_id, async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userId = req.user;
    console.log(userId);
    let profile = await Profile.findById(userId);
    if (!profile) {
      success = true;
      const { email, name, phone, instagram, youtube } = req.body;
      console.log("data received");
      console.log(req.body.email, req.body.name, req.body.phone, req.body.instagram, req.body.youtube);
      const profile = await new Profile({ email, name, phone, instagram, youtube, _id: userId }).save();
      return res.status(200).json({ success, profile });
    }
    else {
      success = true;
      return res.status(200).json({ success, profile });
    }
    console.log(profile);
  }
  catch (error) {
    console.error(error.message);
    return res.status(500).send("Intenal Server Error");
  }

})



module.exports = router;