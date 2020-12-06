const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistItemSchema = new Schema({
    artist_id: {
        required: true,
        type: String,
        unique: true
    },
    artist_name: String,
    url: String,
    image: String
})

module.exports = mongoose.model('Artist', ArtistSchema);