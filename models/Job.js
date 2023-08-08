const { v4: uuidv4 } = require('uuid');
const mongoose =require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema({
  id:{
    type:String,
    default:uuidv4()
  },
  jobtitle:{
    type:String,
    required:true,
  },
  duration:{
    type:String,
    required:true,
  },
  stipend:{
    type:String,
    required:true,
  },
  skills:{
    type:Array,
    required:true,
  },
  positionsAvailable:{
    type:Number,
    required:true,
  },
  location:{
    type:String,
    required:true,
  },
  experience:{
    type:String,
    required:true,
  },
  lastDate:{
    type:Date,
    required:true,
  },
  applicants:{
    type:Number,
  },
  postedOn:{
    type:Date,
    default:Date.now
  },
  company:{
    type:String,
    required:true,
  },
  aboutCompany:{
    type:String,
    required:true,
  },
  requirements:{
    type:String,
    required:true,
  },
  responsibilities:{
    type:String,
    required:true,
  },
});
const Job = mongoose.model('job',JobSchema);
Job.createIndexes();
module.exports=Job;