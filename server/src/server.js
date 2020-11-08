const express = require('express')
const morgan = require('morgan')
const axios = require('axios')
const cors = require('cors');
const queryString = require('querystring');
const cookieParser = require('cookie-parser');
const app = express()
const { generateString, axiosRequest, userCookie } = require('./utils');
const { env } = require('process');
require('dotenv').config()
const mongoose = require('./db.config')
const User = require('./models/user.model');
const { db } = require('./models/user.model');
const jwt = require('jsonwebtoken');
const { ESRCH } = require('constants');
const { error } = require('console');

/// init middleware
app.use(morgan('combined'))
  .use(cors())
  .use(cookieParser());
  
// simplify the environmental variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const STATEKEY = 'spotify_auth_state';

generateToken = async (user) => {return await jwt.sign({id: user.spotify_id}, process.env.COOKIE_KEY, {expiresIn: "7d"});}
validateToken = async (token) => {return await jwt.verify(token, process.env.COOKIE_KEY);}

checkTokenExpiration = async (token) => {
  right_now = Date.now();
  return (
    isFinite(token=this.convert(token).valueOf()) ? (token>right_now)-(token<right_now) : NaN
  );
}

getUserInfo = async (userid) => { return User.findOne({ spotify_id: userid }).exec() }

setFrontEndUser = (user) => {
  // This should always be the data retrieved from the database - at no point should the parameter be anything other than
  // the results from getUserInfo()
  return "This is where I would format all the user's data to send back to the Vue front end"
}

scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-private',
  'user-read-email',
  'user-read-recently-played'
]

app.get('/login', async (req, res) => {
  // Cookie exists?
  if (req.cookies.user) {
    // let's verify the cookie is legit
    let verifiedUser = await validateToken(req.cookies.user);
    if(verifiedUser) {
      // let's see if the user is in the database
      let userInDatabase = await getUserInfo(verifiedUser.id);
      if(userInDatabase) {
        // user is in the database, send the info to the front end
       return res.send(setFrontEndUser(userInDatabase));
      } else {
        // user isn't in the database but they have a cookie - let's get rid of that cookie and start fresh
        res.clearCookie('user');
      }
    }
  }
  // No cookies! Move on to spotify auth
    const state = generateString(16);
    res.cookie(STATEKEY, state);
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

  // gather the authorization code and the returned state from Spotify redirect
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[STATEKEY] : null;

  // validate state matches what we had stored. If it doesn't, redirect to the front end and give the mismatch error
  if (!state || state !== storedState) {
    return res.redirect(
      `${FRONTEND_URI}/#${queryString.stringify({ error: 'state_mismatch' })}`
    );
  }

  // clear the state check cookie
  res.clearCookie('STATEKEY');

  // ASYNC - Use the authorization code to get tokens
  try {
    const params = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: CALLBACK_URL,
      code
    }

    // Axios request for access and refresh tokens
    const { data: { access_token, refresh_token, expires_in } } = await axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Axios request for user info
    const userInfo = await axios({
      url: 'https://api.spotify.com/v1/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    // Tokens and user information retrieved
    //check for existing user
    User.findOne({spotify_id: userInfo.data.id}).exec(async (err, dbuser) => {
     
      // if user exists, make the JWT, store it as a cookie, and send the user info to front end
      if( dbuser != null && dbuser.spotify_id === userInfo.data.id) {
        // return with cookie
        let userToken = await generateToken(dbuser);
        res
        .clearCookie("user")
        .cookie("user", userToken)
        .send({
          spotify_id: dbuser.spotify_id,
          display_name: dbuser.display_name,
          email: dbuser.email
        });
        
      } else {
          // user does not exist in database
        // add to the database
        let date = new Date();
        const newUser = new User({
          spotify_id: userInfo.data.id,
          display_name: userInfo.data.display_name,
          email: userInfo.data.email,
          href: userInfo.data.href,
          images: userInfo.data.images,
          refresh_token: refresh_token,
          access_token: access_token,
          expires_in: date.setDate(date.getDate() + 1)
        }).save((err, dbuser) => {
          // make the JWT, store it as a cookie, and send the user info to front end 
          res
          .cookie('user', generateToken(dbuser))
          .send({
            spotify_id: dbuser.spotify_id,
            display_name: dbuser.display_name,
            email: dbuser.email});
        })
      }
    })
  } catch (e) {
    res.send(e);
  }
});

app.get('/logged', async (req, res) => {
  jwt.verify(req.cookies.user, process.env.COOKIE_KEY, (err, user) => {
    if(err) {
      return res.sendStatus(403);
    } 
    console.log(user)
  })
  const dbuser = await User.findOne({spotify_id: 'kurtyywurtyy'})
  let date = new Date();
  console.log(date);
  console.log(dbuser.expires_in);
  console.log(dbuser.expires_in < date);
})

app.get('/dbtest', async (req,res) => {
  
  const results = await User.findOne({spotify_id: 'kurtyywurtyy'})
  res.send(results);
})

app.get('/test', async (req, res) => {
  const results = await mongoose.find({})
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

if(mongoose.connections[0].name == process.env.MONGODB_DATABASE) {
  console.log('Connected to server - now live on port ' + process.env.PORT)
  app.listen(process.env.PORT)
}
