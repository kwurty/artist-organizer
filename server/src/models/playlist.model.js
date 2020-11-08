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

const PlaylistItemSchema = new Schema({
    artist: String,
    genres: Array
})

exports.Playlist = mongoose.model('Playlist', PlaylistSchema);
exports.PlaylistItem = mongoose.model('PlaylistItem', PlaylistItemSchema);