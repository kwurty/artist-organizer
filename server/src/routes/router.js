const express = require('express');
const router = express.Router()
const auth = require('./auth/auth');
const spotify = require('./spotify/spotify');
const artists = require('./artists/artists');

router.use('/auth', auth);
router.use('/spotify', spotify);
router.use('/artist', artists);

module.exports = router;