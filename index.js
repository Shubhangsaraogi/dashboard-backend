require('dotenv').config();
const connectToMongo = require('./db.js');
const express = require('express')
var cors = require('cors')
connectToMongo();
const app = express();
const port = 5000;

app.use(cors({ origin:'https://notes-app.000.pe/' , credentials :  true}));
app.use(express.json());
app.use('/',(req,res)=>{
  res.json({"message":"hello there this is notes backend server"});
})
app.use('/api/',require('./router/auth'));
app.use('/api/question',require('./router/question'));
app.use('/api/storedata',require('./router/storedata'));
app.use('/api/submission',require('./router/compiler'));

app.listen(port, () => {
  console.log(`Code Arena backend listening on port ${port}`)
})