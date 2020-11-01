const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    spotify_id: {
        required: true,
        type: String,
        unique: true
    },
    display_name: String,
    email: String,
    href: String,
    images: Array,
    refresh_token: String,
    access_token: String,
    expires_in: Date
})

module.exports = mongoose.model('User', UserSchema);