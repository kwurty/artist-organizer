const Axios = require('axios');
const express = require('express');
const router = express.Router();
const { verifyUserInfo, validateTokenMiddle, gatherUserMiddle, checkExpirationMiddle } = require('../../utils');
require('dotenv').config();

router.use(validateTokenMiddle)
    .use(gatherUserMiddle)
    .use(checkExpirationMiddle);
// will need to input pagination for this
router.get('/playlist', async (req,res) => {
    try {
        const {data: {items}} = await Axios({
            method: 'GET',
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${req.user.access_token}`
            },
            params: {
                'limit': 50
            }
        });
    res.json(items);
    }
    catch(err){
        res.status(500).json(err)
    }
});

// Search for artist by category

// Search for artist by name

// Get artist information by ID

router.get('/artist/:id', async (req, res) => {
    try{
        const artist = await Axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${req.user.access_token}`
            }
        })
        res.send(artist.data);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

router.get('/testmiddleware', async (req, res) => {
    res.json(req.user);
})

module.exports = router