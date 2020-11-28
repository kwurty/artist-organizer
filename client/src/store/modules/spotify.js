const Axios = require("axios");

export default {
    state: {
        spotify_playlists: null,
        spotify_playlist_tracks: null,
        artist: null
    },
    mutations: {
        setSpotifyPlaylists(state, playlists) {
            this.state.spotify_playlists = playlists
        },
        setArtist(state, artist) {
            this.state.artist = artist
        },
        setSpotifyPlaylistTracks(state, tracks){
            this.state.spotify_playlist_tracks = tracks
        }
    },
    actions: {
       async getSpotifyPlaylists(context) {
            if(context.rootState.user.access_token){
                const {data: {items}} = await Axios({
                    method: 'GET',
                    url: 'https://api.spotify.com/v1/me/playlists',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${context.rootState.user.access_token}`
                    },
                    params: {
                        'limit': 50
                    }
                });
                console.log(items);
                context.commit('setSpotifyPlaylists', items);
            }
        },
        async getSpotifyPlaylistTracks(context, url) {
            if(context.rootState.user.access_token){
                const {data: {items}} = await Axios({
                    method: 'GET',
                    url,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${context.rootState.user.access_token}`
                    }
                });
                console.log(items);
                context.commit('setSpotifyPlaylistTracks', items);
            }
        }
    },
    getters: {
        getSpotifyPlaylists(state) {
            return state.spotify_playlists;
        },
        getSpotifyPlaylistTracks(state){
            return state.spotify_playlist_tracks;
        }
    }
}