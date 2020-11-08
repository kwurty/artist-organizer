const Axios = require('axios');
require('dotenv').config();

const Spotify = {
    async getPlaylist(token) {
        return await Axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/artists/',
            headers: {
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
    },
    async getArtist(token, id) {

    },
    async getAccessTokenRefresh(refreshToken) {
        const { data: { access_token } } = await Axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            params: {
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });

        return access_token
    }
}