const Axios = require('axios');
require('dotenv').config();

const Spotify = {
    async getPlaylist(token) {
        return await Axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    },
    async getArtist(token, id) {
        return await Axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/artists'
        })
    },
    
}

module.exports = Spotify