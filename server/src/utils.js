const axios = require('axios')
const jwt = require('jsonwebtoken');

exports.generateString = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.axiosRequest = (params) => axios({
  url: 'https://accounts.spotify.com/api/token',
  method: 'POST',
  params,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});


exports.generateToken = async (user) => { return await jwt.sign({ id: user.spotify_id }, process.env.COOKIE_KEY, { expiresIn: "7d" }); }
exports.validateToken = async (token) => { return await jwt.verify(token, process.env.COOKIE_KEY); }
exports.isTokenExpired = (time) => {
  let date = new Date().getTime();
  let expires = new Date(time).getTime();
  return (expires < date)
}