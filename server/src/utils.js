const axios = require('axios');
const e = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user.model');

exports.generateString = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.getUserInfo = async (userid) => { console.log(`checking ${userid} info`); return User.findOne({ spotify_id: userid }).exec() }


exports.generateToken = async (user) => { return await jwt.sign({ id: user.spotify_id }, process.env.COOKIE_KEY, { expiresIn: "7d" }); }
exports.validateToken = async (token) => { return await jwt.verify(token, process.env.COOKIE_KEY); }
exports.isTokenExpired = (time) => {
  let date = new Date().getTime();
  let expires = new Date(time).getTime();
  return (expires < date)
}

exports.validateTokenMiddle = async (req, res, next) => {
  // console.log("validate");
  try {
    let user = await jwt.verify(req.query.token, process.env.COOKIE_KEY);
    req.user = user;
    next()
  }
  catch (err) {
    res.status(500).json(err)
  }
}

exports.gatherUserMiddle = async (req, res, next) => {
  // console.log("gather");
  try {
    let user = await User.findOne({ spotify_id: req.user.id }).exec()
    req.user = user;
    next();
  }
  catch (err) {
    res.status(500).json(err);
  }
}

exports.checkExpirationMiddle = async (req, res, next) => {
  // console.log(req.user); 
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
  next()
}
exports.verifyUserInfo = async (req, res, next) => {
  try {
    if (req.cookies.user) {
      const token = await this.validateToken(req.cookies.user);
      console.log("token:", token)
      if (token.id) {
        const user = await User.findOne({ spotify_id: token.id }, 'access_token expires_in refresh_token')
        console.log("user:", user)
        if (await this.isTokenExpired(user.expires_in)) {
          let userAccessToken = await axios({
            method: 'get',
            url: `${process.env.BACKEND_URI}spotify/refresh_token`,
            params: {
              refresh_token: user.refresh_token
            }
          });
          console.log("access token :", userAccessToken)
          try {
            let results = await User.findByIdAndUpdate(user.id, { "access_token": userAccessToken });
            console.log("dbupdate result: ", results);
            user.access_token = userAccessToken;
            console.log("final user: ", req.user);
            req.user = user;
          }
          catch (err) {
            res.status(500).json(err)
          }
        }
        next();
      }
    } else {
      next();
    }
  }
  catch (err) {
    console.log('error');
    res.status(500).json(err)
  }
}

exports.setFrontEndUser = (user) => {
  // This should always be the data retrieved from the database - at no point should the parameter be anything other than
  // the results from getUserInfo()
  return {
    id: user.id,
    display_name: user.spotify_id,
    access_token: user.access_token,
    artist_playlists: {

    },
    images: {

    },
  }
  // return "This is where I would format all the user's data to send back to the Vue front end"
}