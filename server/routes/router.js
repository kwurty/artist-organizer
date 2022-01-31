const express = require('express');
const router = express.Router()

router.use('/', require('./auth/auth'));
router.use('/spotify', require('./spotify/spotify'));
router.use('/artist', require('./artists/artists'));

module.exports = router;