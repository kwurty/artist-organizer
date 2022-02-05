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


router.use(async (req, res, next) => {
    console.log('checking token')
    let token = req.body.token ? req.body.token : req.query.token;
    console.log(`token - ${token}`);

    try {
        let user = await jwt.verify(req.query.token, COOKIE_KEY);
        console.log(`user - ${user.id}`)
        console.log('token is good')
        req.user = user;
        next()
    }
    catch (err) {
        res.status(500).json(err)
    }
});

router.get('/playlists', async (req, res, next) => {
    console.log(req.params);
    try {
        Playlist.find({ spotify_id: req.user.id }).exec(async (err, results) => {
            if (err) {
                res.send(err);
                console.log(err);
            }
            if (results.length > 0) {
                res.send(results);
            }
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
})

router.post('/playlist', async (req, res) => {
    let id = jwt.verify(req.body.token, COOKIE_KEY);
    if (id) {
        console.log(id);
        let right_now = new Date();
        const newPlaylist = new Playlist({
            spotify_id: id,
            display_name: req.body.name,
            created_at: right_now
        }).save((err, playlist) => {
            if (err) return res.status(500).json(err)
            res.send(playlist);
        })


    }
})

// router.get('/playlists', async (req, res) => {
//     console.log('checking expiration date')
//     try {
//         let right_now = new Date();
//         let expires = new Date(req.user.expires_in);
//         if (expires < right_now) {
//             console.log('expired');
//             const { data: { access_token } } = await axios({
//                 url: `https://accounts.spotify.com/api/token`,
//                 method: 'POST',
//                 params: {
//                     refresh_token: req.user.refresh_token,
//                     grant_type: 'refresh_token',
//                     client_id: process.env.CLIENT_ID,
//                     client_secret: process.env.CLIENT_SECRET
//                 }
//             });

//             let date = new Date();
//             User.findByIdAndUpdate(req.user._id, { 'access_token': access_token, 'expires_in': date.setHours(date.getHours() + 1) }, (err, result) => {
//                 if (err) console.log(err)
//                 else req.user = result;
//             });
//         }
//     }
//     catch (err) {
//         // console.log(err);
//         // res.status(500).json(err);
//     }
//     console.log('sending user');
//     res.send(req.user);
// });


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

// router.use('/playlists', async (req, res, next) => {
//     console.log('got the middleware')
//     try {
//         let token = req.body.token ? req.body.token : req.query.token;
//         console.log(`token - ${token}`)
//         let user = await jwt.verify(token, COOKIE_KEY);
//         console.log('token is good')
//         req.user = user;
//         next()
//     } catch (err) {
//         res.status(500).json(err)
//     }

// })



// // finish this...
// router.post('/playlist/add', async (req, res, next) => {

//     console.log(req.body);

//     try {
//         Playlist.findOne({
//             '_id': req.body.playlistId,
//             'artists.artistid': req.body.artistId
//         }).exec(async (err, playlist) => {
//             if (playlist) {
//                 res.status(200).send(playlist)
//             } else {
//                 Playlist.findByIdAndUpdate(
//                     req.body.playlistId,
//                     {
//                         $push: {
//                             'artists': {
//                                 'artistname': req.body.artistName,
//                                 'artistid': req.body.artistId,
//                                 'artisturl': req.body.artistUrl,
//                                 'artistimage': req.body.artistImage
//                             }
//                         }
//                     }, async (err, results) => {
//                         if (err) {
//                             res.status(500).send(err);
//                         }
//                         res.send(results);
//                     })
//             }
//         });

//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// module.exports = router;