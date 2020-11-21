const express = require('express')
const morgan = require('morgan')
const axios = require('axios')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express()
const { isTokenExpired } = require('./utils');
require('dotenv').config()
const mongoose = require('./db.config')
const User = require('./models/user.model');
const router = require('./routes/router');

/// init middleware
app.use(morgan('combined'))
  .use(cors())
  .use(cookieParser());


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
