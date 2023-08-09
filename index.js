require('dotenv').config();
const connectToMongo = require('./db.js');
const express = require('express')
const compression = require("compression");
const helmet = require("helmet");
var cors = require('cors')
connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(x => x
  .AllowAnyMethod()
  .AllowAnyHeader()
  .SetIsOriginAllowed(origin => true) // allow any origin
  .AllowCredentials());
app.use(compression()); 
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);
app.use(express.json());
app.use('/api/storedata',require('./router/storedata'));
app.use('/api/',require('./router/auth'));
app.use('/api/question',require('./router/question'));
app.use('/api/submission',require('./router/compiler'));

app.listen(port, () => {
  console.log(`Code Arena backend listening on port ${port}`)
})