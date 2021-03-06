const Axios = require('axios');
const express = require('express');
const router = express.Router();
const Playlist = require('../../models/playlist.model');
const queryString = require('querystring');
const jwt = require('jsonwebtoken');
const { verifyUserInfo, validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle } = require('../../utils');
require('dotenv').config();
const middle = [validateTokenMiddle, gatherUserMiddle];

router.get('/playlists', middle, async (req, res, next) => {
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

router.get('/playlist', middle, async (req, res, next) => {
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

router.post('/playlist', middle, async (req, res, next) => {
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
    // const playlist = new Playlist({

    // })
})

// finish this...
router.post('/playlist/add', middle, async (req, res, next) => {

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