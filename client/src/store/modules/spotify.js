const Axios = require("axios");

export default {
    state: {
        spotify_playlists: null,
        spotify_playlist_tracks: null,
        artist: null,
        search_results: null
    },
    mutations: {
        setSpotifyPlaylists(state, playlists) {
            this.state.spotify_playlists = playlists
        },
        setArtist(state, artist) {
            this.state.artist = artist
        },
        setSpotifyPlaylistTracks(state, tracks) {
            this.state.spotify_playlist_tracks = tracks
        },
        // I have zero idea why this one works with the state input
        // but the others have to use this.state
        // ???
        setSearchResults(state, results) {
            state.search_results = results
        }
    },
    actions: {
        async getSpotifyPlaylists(context) {
            if (context.rootState.user.access_token != undefined) {
                const { data: { items } } = await Axios({
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
                (items);
                context.commit('setSpotifyPlaylists', items);
            }
        },
        async getSpotifyPlaylistTracks(context, url) {
            if (context.rootState.user.access_token != undefined) {
                const { data } = await Axios({
                    method: 'GET',
                    url,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${context.rootState.user.access_token}`
                    }
                });
                context.commit('setSpotifyPlaylistTracks', data);
            }
        },
        async getSearchResults(context, search) {
            ("search", search);
            if (context.rootState.user.access_token) {

                try {

                }
                catch(e) {
                    context.commit('setSearchResults', e);
                }
                const { data: { albums, artists, tracks } } = await Axios({
                    method: 'GET',
                    url: 'https://api.spotify.com/v1/search',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${context.rootState.user.access_token}`
                    },
                    params: {
                        type: 'artist,track,album',
                        q: search
                    }
                });
                let results = {
                    albums: albums.items,
                    artists: artists.items,
                    tracks: tracks.items
                }
                context.commit('setSearchResults', results);
            }
        }
    },
    getters: {
        getSpotifyPlaylists(state) {
            return state.spotify_playlists;
        },
        getSpotifyPlaylistTracks(state) {
            return state.spotify_playlist_tracks;
        },
        getSearchResultItems(state) {
            return state.search_results;
        }
    }
}