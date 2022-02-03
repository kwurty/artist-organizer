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
const FRONTEND_URI = process.env.FRONTEND_URI;
const STATEKEY = 'spotify_auth_state';
const scopes = ['playlist-read-private', 'playlist-read-collaborative', 'user-read-private', 'user-read-email', 'user-read-recently-played']
const middle = [validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle];

router.get('/login', async (req, res) => {
  // Cookie exists?
  if (req.cookies.user) {
    // let's verify the cookie is legit
    let verifiedUser = await validateToken(req.cookies.user);
    if (verifiedUser) {
      // let's see if the user is in the database
      let userInDatabase = await getUserInfo(verifiedUser.id);
      if (userInDatabase) {
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
})

router.get('/loggedin', async (req, res) => {

  // gather the authorization code and the returned state from Spotify redirect
  // ********** REMOVING THE CHECK OF COOKIE PUSHED FROM CLIENT -- WILL USE JWT TOKEN INSTEAD

  const { code, state } = req.query;
  // const storedState = req.cookies ? req.cookies[STATEKEY] : null;

  // validate state matches what we had stored. If it doesn't, redirect to the front end and give the mismatch error
  // if (!state || state !== storedState) {
  //   return res.redirect(
  //     `${FRONTEND_URI}/#${queryString.stringify({ error: 'state_mismatch' })}`
  //   );
  // }

  // clear the state check cookie
  // res.clearCookie('STATEKEY');

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
    User.findOne({ spotify_id: userInfo.data.id }).exec(async (err, dbuser) => {
      // if user exists, make the JWT, store it as a cookie, and send the user info to front end
      if (dbuser != null && dbuser.spotify_id === userInfo.data.id) {
        // return with cookie
        User.findByIdAndUpdate(dbuser.id, { refresh_token, access_token }, async (e, dbuser) => {
          if (e) res.status(500).send(e)
          else {
            let userToken = await generateToken(dbuser);
            res

              //AGAIN REMOVING COOKIES HERE
              // .clearCookie("user")
              // .cookie("user", userToken, {
              //   domain: "https://artlists.kwurty.com"
              // })
              .redirect(process.env.FRONTEND_URI + '/auth?token=' + userToken);
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
  console.log('checking token')
  try {
    let user = await jwt.verify(req.params.token, process.env.COOKIE_KEY);
    console.log('token is good')
    req.user = user;
    next()
  }
  catch (err) {
    res.status(500).json(err)
  }
});
router.use('/checklogin', async (req, res, next) => {
  console.log('checking for user in db')
  try {
    let user = await User.findOne({ spotify_id: req.user.id }).exec()
    console.log('finished finding user in db')
    req.user = user;
    next();
  }
  catch (err) {
    res.status(500).json(err);
  }
});
router.get('/checklogin', async (req, res) => {
  console.log('checking expiration date')
  try {
    let right_now = new Date();
    let expires = new Date(req.user.expires_in);
    if (expires < right_now) {
      console.log('expired');
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
  console.log('sending user');
  res.send(user);
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