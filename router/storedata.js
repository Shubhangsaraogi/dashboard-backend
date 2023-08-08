const express = require('express');
const Job = require('../models/Job');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/', [
  body('jobtitle', 'Enter a valid String').isString(),
  body('duration', 'Enter a valid String').isString(),
  body('stipend', 'Enter a valid String').isString(),
  body('location', 'Enter a valid String').isString(),
  body('experience', 'Enter a valid String').isString(),
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors:errors.array()});
  }
  try{
    let job= await Job.findOne({jobtitle:req.body.jobtitle,company:req.body.company});
    if(job)
    {
      return res.status(400).json({error:"This job post already exist"});
    }
    job=await Job.create({
      jobtitle: req.body.jobtitle,
      duration: req.body.duration,
      stipend: req.body.stipend,
      skills: req.body.skills,
      positionsAvailable: req.body.positionsAvailable,
      location: req.body.location,
      experience: req.body.experience,
      lastDate: req.body.lastDate,
      applicants: req.body.applicants,
      postedOn: req.body.postedOn,
      company: req.body.company,
      aboutCompany: req.body.aboutCompany,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
    });
    res.json(job);
  }
  catch(error)
  {
    console.error(error.message);
    res.status(500).send("some error occured");
  }

  var bcrypt = require('bcryptjs');
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync("B4c0/\/", salt);
  // const job = Job(req.body);
  // job.save();

})

module.exports = router;