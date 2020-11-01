const express = require('express')
const morgan = require('morgan')
const axios = require('axios')
const cors = require('cors');
const queryString = require('querystring');
const cookieParser = require('cookie-parser');
const app = express()
const { generateString, axiosRequest } = require('./utils');
const { env } = require('process');
require('dotenv').config()
const mongoose = require('./db.config')
const User = require('./models/user.model');
const { db } = require('./models/user.model');

app.use(morgan('combined'))
  .use(cors())
  .use(cookieParser());
  
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

var stateKey = 'spotify_auth_state';

scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-private',
  'user-read-email',
  'user-read-recently-played'
]

app.get('/login', (_, res) => {
  const state = generateString(16);
  res.cookie(stateKey, state);

  return res.redirect(
    `https://accounts.spotify.com/authorize?${queryString.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scopes.join(' '),
      redirect_uri: CALLBACK_URL,
      state: state,
      show_dialog: true
    })}`,
  );
});


app.get('/loggedin', async (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (!state || state !== storedState) {
    return res.redirect(
      `${FRONTEND_URI}/#${queryString.stringify({ error: 'state_mismatch' })}`
    );
  }

  res.clearCookie(stateKey);

  try {
    const params = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: CALLBACK_URL,
      code
    }


    const { data: { access_token, refresh_token, expires_in } } = await axiosRequest(params);    
    const userInfo = await axios({
      url: 'https://api.spotify.com/v1/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    User.findOne({spotify_id: userInfo.data.id}).exec((err, dbuser) => {
     
      err ? res.send(err) : null

      if(dbuser.spotify_id === userInfo.data.id) {
        // user exists in database - check the time and get refresh token
        res.send(dbuser)
      } else {
                // user does not exist in database
        // must add user to database now
        let date = new Date();
        const newUser = new User({
          spotify_id: userInfo.data.id,
          display_name: userInfo.data.display_name,
          email: userInfo.data.email,
          href: userInfo.data.href,
          images: userInfo.data.images,
          refresh_token: refresh_token,
          access_token: access_token,
          expires_in: date.setDate(date.getDate() + (expires_in * 1000))
        }).save((err, user) => {
          err ? res.send(err) : res.send(user);
        })
      }

      
      })

  } catch (e) {
    res.send(e);
  }
});

app.get('/logged', async (req, res) => {
  console.log(req);
  res.send(req.data);
})

app.get('/dbtest', async (req,res) => {
  const results = await mongoose.find({})
  res.send(results);
}) 

app.get('/refresh_token', async (req, res) => {
  const { refresh_token } = req.query;

  if (!refresh_token) return res.status(401).send('Invalid refresh token');

  try {
    const params = {
      refresh_token,
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }

    const { data: { access_token } } = await axiosRequest(params);

    res.json({
      access_token
    });
  } catch (e) {
    res.status(401).send('Invalid token');
  }
});



// Launch server

if(mongoose.connections[0].name == 'spotifyartists') {
  console.log('Connected to server - now live on port ' + process.env.PORT)
  app.listen(process.env.PORT)
}
