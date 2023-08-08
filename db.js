const mongoose = require('mongoose');
const mongoURI = process.env.DATABASE_URL;

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
}

module.exports = connectToMongo;
