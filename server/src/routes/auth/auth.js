const express = require('express')
const router = express.Router()
const User = require('../../models/user.model');
const queryString = require('querystring');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const { generateString, validateToken, validateTokenMiddle, generateToken, setFrontEndUser, getUserInfo, gatherUserMiddle, checkExpirationMiddle } = require('../../utils');
const { send } = require('process');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.REDIRECT_URI;
const COOKIE_KEY = process.env.COOKIE_KEY;
const FRONTEND_URI = process.env.FRONTEND_URI;
const STATEKEY = 'spotify_auth_state';
const scopes = ['playlist-read-private', 'playlist-read-collaborative', 'user-read-private', 'user-read-email', 'user-read-recently-played']
const middle = [validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle];

router.get('/login', async (req, res) => {
  return res.redirect(
    `https://accounts.spotify.com/authorize?${queryString.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scopes.join(' '),
      redirect_uri: CALLBACK_URL,
      show_dialog: true
    })}`,
  );
})

router.get('/loggedin', async (req, res) => {
  const { code } = req.query;

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
    User.findOne({ spotify_id: userInfo.data.id }).exec(async (err, dbuser) => {
      // if user exists, make the JWT, store it as a cookie, and send the user info to front end
      if (dbuser != null && dbuser.spotify_id === userInfo.data.id) {
        // return with cookie
        User.findByIdAndUpdate(dbuser.id, { refresh_token, access_token }, async (e, dbuser) => {
          if (e) res.status(500).send(e)
          else {
            let userToken = await generateToken(dbuser);
            res.redirect(process.env.FRONTEND_URI + '/auth?token=' + userToken);
          }
        })
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
          expires_in: date.setHours(date.getHours() + 1)
        }).save(async (err, dbuser) => {
          // make the JWT, store it as a cookie, and send the user info to front end 
          let userToken = await generateToken(dbuser);
          res
            // .cookie('user', token)
            .redirect(process.env.FRONTEND_URI + '/auth?token=' + userToken);
        })
      }
    })
  } catch (e) {
    res.status(500).json(e);
  }
});

router.use('/checklogin', async (req, res, next) => {
  try {
    let user = await jwt.verify(req.query.token, COOKIE_KEY);
    req.user = user;
    next()
  }
  catch (err) {
    res.status(500).json(err)
  }
});
router.use('/checklogin', async (req, res, next) => {
  try {
    let user = await User.findOne({ spotify_id: req.user.id }).exec()
    req.user = user;
    next();
  }
  catch (err) {
    res.status(500).json(err);
  }
});
router.get('/checklogin', async (req, res) => {
  try {
    let right_now = new Date();
    let expires = new Date(req.user.expires_in);
    if (expires < right_now) {
      const { data: { access_token } } = await axios({
        url: `https://accounts.spotify.com/api/token`,
        method: 'POST',
        params: {
          refresh_token: req.user.refresh_token,
          grant_type: 'refresh_token',
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET
        }
      });

      let date = new Date();
      User.findByIdAndUpdate(req.user._id, { 'access_token': access_token, 'expires_in': date.setHours(date.getHours() + 1) }, (err, result) => {
        if (err) console.log(err)
        else req.user = result;
      });
    }
  }
  catch (err) {
    // console.log(err);
    // res.status(500).json(err);
  }
  res.send(req.user);
});


// router.get('/logged', async (req, res) => {
//   jwt.verify(req.cookies.user, process.env.COOKIE_KEY, (err, user) => {
//     if (err) {
//       return res.status(403).send(err);
//     }
//     console.log('this is the user:', user)
//   })
//   const dbuser = await User.findOne({ spotify_id: 'kurtyywurtyy' })
//   res.send(dbuser);
// })

router.get('/dbtest', async (req, res) => {
  const results = await User.findOne({ spotify_id: 'kurtyywurtyy' })
  res.send(results);
})

module.exports = router;