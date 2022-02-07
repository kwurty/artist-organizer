const express = require('express');
const router = express.Router();
const Playlist = require('../../models/playlist.model');
const jwt = require('jsonwebtoken');
const { generateString, validateToken, validateTokenMiddle, generateToken, setFrontEndUser, getUserInfo, gatherUserMiddle, checkExpirationMiddle } = require('../../utils');
const COOKIE_KEY = process.env.COOKIE_KEY;

router.use('/playlists', async (req, res, next) => {
    console.log('- Artist middleware - checking token')
    let token = req.body.token ? req.body.token : req.query.token;
    console.log(`token - ${token}`);

    try {
        let user = await jwt.verify(req.query.token, COOKIE_KEY);
        console.log(`- Artist Middleware - user - ${user.id}`)
        req.user = user;
        next()
    }
    catch (err) {
        res.status(500).json(err)
    }
});

router.get('/playlists', async (req, res, next) => {
    console.log(`- Playlists get - req user id - ${req.user.id}`);

    Playlist.find({ spotify_id: req.user.id }).exec(async (err, results) => {
        if (err) {
            res.send(err);
            console.log(err);
        }
        else {
            console.log(`- Playlists Get - Playlists found`)
            res.send(results);
        }
    });
})
router.use('/playlist', express.json(), async (req, res, next) => {
    let token = req.body.token ? req.body.token : req.query.token;
    try {
        let user = await jwt.verify(token, COOKIE_KEY);
        req.user = user;
        next()
    }
    catch (err) {
        res.status(500).json(err)
    }
});

router.post('/playlist', async (req, res) => {
    let newPlaylist = new Playlist({
        spotify_id: req.user.id,
        display_name: req.body.name,
        created_at: new Date()
    }).save((err, playlist) => {
        if (err) return res.status(500).json(err)

        res.send(playlist);
    })
})

router.get('/playlist', async (req, res) => {
    Playlist.findById(req.query.id).exec(async (err, results) => {
        if (err) return res.status(500).json(err)

        res.send(results);
    })
})

// router.use('/playlist/add', async (req, res, next) => {
//     let token = req.body.token ? req.body.token : req.query.token;
//     try {
//         let user = await jwt.verify(token, COOKIE_KEY);
//         req.user = user;
//         next()
//     }
//     catch (err) {
//         res.status(500).json(err)
//     }
// })

router.post('/playlist/add', async (req, res, res) => {

    try {
        Playlist.findOne({
            '_id': req.body.playlistId,
            'spotify_id': req.user.id,
            'artists.artistid': req.body.artistId
        }).exec(async (err, playlist) => {
            if (playlist) {
                res.status(200).send(playlist)
            } else {
                Playlist.findByIdAndUpdate(
                    req.body.playlistId,
                    {
                        $push: {
                            'artists': {
                                'artistname': req.body.artistName,
                                'artistid': req.body.artistId,
                                'artisturl': req.body.artistUrl,
                                'artistimage': req.body.artistImage
                            }
                        }
                    }, async (err, results) => {
                        if (err) {
                            res.status(500).send(err);
                        }
                        res.send(results);
                    })
            }
        });

    } catch (e) {
        res.status(500).send(e)
    }
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