require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
// const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const { isTokenExpired } = require('./utils');
const mongoose = require('./db.config');
const User = require('./models/user.model');
const router = require('./routes/router');

/// init middleware
app.use(morgan('combined'))
  // .use(cors())
  .use(cookieParser())
  .use(express.json());


app.use(function (req, res, next) {
  const regex = /^.+?[^\/:](?=[?\/]|$)/;
  let origin = req.get('origin');
  let referer = req.get('referer');
  let allowedDomains = ["http://localhost:8080", "https://artlists.kwurty.com", "https://artistplaylists.herokuapp.com"]
  if (referer && allowedDomains.includes(referer.match(regex)[0])) {
    res.header("Access-Control-Allow-Origin", referer);

  }
  if (origin && allowedDomains.includes(origin.match(regex)[0])) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
  // res.header("Access-Control-Allow-Origin", "localhost:8080"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

app.use('/', router)


// console.log('dotenv', process.env);
// Launch server

app.listen(process.env.PORT)
console.log('Connected to database - now live on port ' + process.env.PORT)
