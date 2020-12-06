const Axios = require('axios');
const express = require('express');
const router = express.Router();
const Playlist = require('../../models/playlist.model');
const queryString = require('querystring');
const jwt = require('jsonwebtoken');
const { verifyUserInfo, validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle } = require('../../utils');
require('dotenv').config();
const middle = [validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle];

router.get('/playlists', [validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle], async (req,res, next) => {
    try{
        Playlist.findMany({spotify_id: req.user.spotify_id}).exec(async (err, results) => {
            if( results.length > 1) {
                res.send(results);
            }
        });
    }
    catch(e){
        res.status(500).send(e);
    }
})

router.post('/playlist', [validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle], async(req, res, next) => {
    res.send(req.body);
    // const playlist = new Playlist({

    // })
})

module.exports = router;