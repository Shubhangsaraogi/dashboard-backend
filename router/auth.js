const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fetch_id = require('../middleware/fetch_id');
// route 1 to signup the user
router.post('/createuser', [
  body('name', 'Enter a valid String').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "User already exist with this email" });
    }
    // console.log(user);
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt)
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        role: "admin"
      });
    // res.json(user);
    const data = {
      id: user.id
    }
    var authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    res.status(200).json({ success, email: req.body.email, authToken });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send(success, "Internal Server Error");
  }

})

// route 2 to login the user
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be empty').exists()
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
    // console.log(user);
    const passwordCompare =await bcrypt.compare(password, user.password);

    if (!passwordCompare){
      return res.status(400).json({ success, error: "Please Login with correct credentials" });
    }

    const data = {
      id: user.id
    }
    var authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    res.status(200).json({ success, email: req.body.email, authToken });

  }
  catch (error) {
    console.error(error.message);
    res.status(500).send(success, "Internal Server Error");
  }

})

// Route 3 to fetch the user
router.post('/getuser', fetch_id, async (req, res) => {

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    userId = req.user;
    let user = await User.findById(userId).select("-password");
    success = true;
    res.send({ success, user });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send(success, "Intenal Server Error");
  }

})

module.exports = router;