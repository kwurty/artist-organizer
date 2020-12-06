const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    spotify_id: {
        required: true,
        type: String,
        unique: true
    },
    display_name: String,
    artists: Array
})


module.exports = mongoose.model('Playlist', PlaylistSchema);