const Axios = require('axios');
const express = require('express');
const router = express.Router();
const Playlist = require('../../models/playlist.model');
const queryString = require('querystring');
const jwt = require('jsonwebtoken');
const { verifyUserInfo, validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle } = require('../../utils');
require('dotenv').config();
// router.use(validateTokenMiddle)
//     .use(gatherUserMiddle)

router.get('/playlists', async (req, res, next) => {
    try {
        Playlist.find({ spotify_id: req.user.spotify_id }).exec(async (err, results) => {
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

router.get('/playlist', async (req, res, next) => {
    try {
        Playlist.findById(req.query.id).exec(async (err, results) => {
            if (err) {
                res.send(err)
            } else {
                console.log(results);
                res.send(results);
            }
        })
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})

router.use('/playlist', async (req, res, next) => {
    try {
        let user = await jwt.verify(req.body.token, process.env.COOKIE_KEY);
        console.log(user);
        req.user = user;
    } catch (err) {
        res.status(500).json(err)
    }
})

router.use('/playlist', async (req, res, next) => {
    console.log('trying to get user')
    console.log(req.user);
    try {
        let user = await User.findOne({ spotify_id: req.user.id }).exec()
        req.user = user;
        console.log('good')
        next()
    } catch (err) {
        res.status(500).json(err)
    }
})
router.post('/playlist', async (req, res) => {
    console.log('trying to make playlist')
    try {
        let right_now = new Date();
        const newPlaylist = new Playlist({
            spotify_id: req.user.spotify_id,
            display_name: req.body.name,
            created_at: right_now
        }).save(async (err, playlist) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(playlist)
            }
        })
    }
    catch (e) {
        res.status(500).send(e);
    }
})

// finish this...
router.post('/playlist/add', async (req, res, next) => {

    console.log(req.body);

    try {
        Playlist.findOne({
            '_id': req.body.playlistId,
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