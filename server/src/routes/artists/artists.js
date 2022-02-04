const Axios = require('axios');
const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
const Playlist = require('../../models/playlist.model');
const queryString = require('querystring');
const jwt = require('jsonwebtoken');
const { verifyUserInfo, validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle } = require('../../utils');
require('dotenv').config();
// router.use(validateTokenMiddle)
//     .use(gatherUserMiddle)

const COOKIE_KEY = process.env.COOKIE_KEY;

router.use(async (req, res, next) => {
    console.log('testing token')
    try {
        let user = await jwt.verify(req.query.token, COOKIE_KEY);
        console.log('token is good')
        req.user = user;
        next()
    } catch (err) {
        res.status(500).json(err)
    }

})

router.get('/playlists', async (req, res) => {
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