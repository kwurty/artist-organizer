const express = require('express');
const router = express.Router()

router.use('/', require('./auth/auth'));
router.use('/spotify', require('./spotify/spotify'));

module.exports = router;