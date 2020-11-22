const axios = require("axios");

export default {
    state: {
        spotify_playlist: {

        },
        artist: {

        }
    },
    mutations: {
        setPlaylist(state, playlist) {
            state.spotify_playlist = playlist
        },
        setArtist(state, artist) {
            state.artist = artist
        }
    },
    actions: {
        getPlaylist(context) {
            console.log(context);
            axios.console();
        }
    },
    getters: {

    }
}