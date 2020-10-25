const express = require('express')
const morgan = require('morgan')
const axios = require('axios')
const cors = require('cors');
const queryString = require('querystring');
const cookieParser = require('cookie-parser');
const app = express()
const { generateString } = require('./utils');

require('dotenv').config()

app.use(morgan('combined'))
.use(cors())
.use(cookieParser());
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
        client_id: process.env.CLIENT_ID,
        scope: scopes.join(' '),
        redirect_uri: process.env.REDIRECT_URI,
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
  
      const { data: { access_token, refresh_token } } = await axiosRequest(params);
      
      res.redirect(
        `${FRONTEND_URI}/#${queryString.stringify({
          access_token,
          refresh_token
        })}`,
      );
    } catch (e) {
      res.redirect(`${FRONTEND_URI}/#${queryString.stringify({ error: 'invalid_token' })}`);
    }
  });
  
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


app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})