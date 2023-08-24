const { text } = require('express');
const mongoose =require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  adminId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
  },
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  testCases:{
    type:String,
  }
});
const Question = mongoose.model('question',QuestionSchema);
Question.createIndexes({title:'text'});
module.exports=Question;