require('dotenv').config();
const connectToMongo = require('./db.js');
const express = require('express')
var cors = require('cors')
connectToMongo();
const app = express();
const port = 5000;

app.use(cors())
app.use(express.json());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use('/api/storedata',require('./router/storedata'));
app.use('/api/',require('./router/auth'));
app.use('/api/question',require('./router/question'));
app.use('/api/submission',require('./router/compiler'));

app.listen(port, () => {
  console.log(`Code Arena backend listening on port ${port}`)
})