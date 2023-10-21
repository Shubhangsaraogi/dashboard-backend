require('dotenv').config();
const connectToMongo = require('./db.js');
const express = require('express')
var cors = require('cors')
connectToMongo();
const app = express();
const port = 5000;

app.use(cors({origin:'https://shubhang-dashboard.vercel.app'}));
app.use(express.json());
// app.use('/',(req,res)=>{
//   res.json({"message":"hello there this is notes backend server"});
// })
app.use('/api/',require('./router/auth'));

app.listen(port, () => {
  console.log(`Code Arena backend listening on port ${port}`)
})