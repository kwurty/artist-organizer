const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    spotify_id: {
        required: true,
        type: String,
        unique: false
    },
    display_name: {
        type: String,
        required: true,
        unique: false
    },
    artists: Array,
    created_at: Date
})


module.exports = mongoose.model('Playlist', PlaylistSchema);