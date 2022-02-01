const express = require('express')
const morgan = require('morgan')
const axios = require('axios')
// const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express()
const { isTokenExpired } = require('./utils');
require('dotenv').config()
const mongoose = require('./db.config')
const User = require('./models/user.model');
const router = require('./routes/router');

/// init middleware
app.use(morgan('combined'))
  // .use(cors())
  .use(cookieParser())
  .use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080", "https://artlists.kwurty.com");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
  // res.header("Access-Control-Allow-Origin", "localhost:8080"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});


app.get('/testtoken', async (req, res) => {
  // grabbing this from middleware - test only
  let expires = new Date(req.cookies.user.expires_in).getTime();
  res.send(isTokenExpired(expires));
})

app.use('/', router)


// Launch server

if (mongoose.connections[0].name == process.env.MONGODB_DATABASE) {
  console.log('Connected to database - now live on port ' + process.env.PORT)
  app.listen(process.env.PORT)
}
