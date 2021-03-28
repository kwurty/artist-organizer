const Axios = require("axios");

export default {
  state: {
    spotify_playlists: null,
    spotify_playlist_tracks: null,
    artist: null,
    artistInfo: null,
    search_results: null,
    recently_played: null
  },
  mutations: {
    setSpotifyPlaylists(state, playlists) {
      this.state.spotify_playlists = playlists;
    },
    setArtist(state, artist) {
      this.state.artist = artist;
    },
    setArtistInfo(state, artistInfo) {
      this.state.artistInfo = artistInfo;
    },
    setSpotifyPlaylistTracks(state, tracks) {
      this.state.spotify_playlist_tracks = tracks;
    },
    setSearchResults(state, results) {
      this.state.search_results = results;
    },
    setRecentlyPlayed(state, tracks) {
      console.log(tracks);
      this.state.recently_played = tracks;
    }
  },
  actions: {
    async getSpotifyPlaylists(context) {
      if (context.rootState.user.access_token != undefined) {
        const {
          data: { items },
        } = await Axios({
          method: "GET",
          url: "https://api.spotify.com/v1/me/playlists",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${context.rootState.user.access_token}`,
          },
          params: {
            limit: 50,
          },
        });
        context.commit("setSpotifyPlaylists", items);
      }
    },
    async getSpotifyPlaylistTracks(context, playlistInfo) {
      try {
        if (context.rootState.user.access_token != undefined) {
          const { data: {
            items
          }, data: { next } } = await Axios({
            method: "GET",
            url: playlistInfo.url,
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${context.rootState.user.access_token}`,
            },
          });
          let newTracks = [...playlistInfo.allTracks, ...items];
          if (next != null) {
            context.dispatch("getSpotifyPlaylistTracks", { url: next, allTracks: newTracks })
          } else {
            context.commit("setSpotifyPlaylistTracks", newTracks);
          }
        }
      }
      catch (e) {
        console.error(e);
      }

    },
    async getSearchResults(context, search) {
      if (context.rootState.user.access_token) {
        const {
          data: { albums, artists, tracks },
        } = await Axios({
          method: "GET",
          url: "https://api.spotify.com/v1/search",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${context.rootState.user.access_token}`,
          },
          params: {
            type: "artist,track,album",
            q: search,
          },
        });
        let results = {
          albums: albums.items,
          artists: artists.items,
          tracks: tracks.items,
        };
        context.commit("setSearchResults", results);
      }
    },

    async getArtist(context, artistId) {
      try {
        if (context.rootState.user.access_token != undefined) {
          const { data } = await Axios({
            method: "GET",
            url: `https://api.spotify.com/v1/artists/${artistId}`,
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${context.rootState.user.access_token}`,
            },
          });
          context.commit("setArtist", data)
          context.dispatch("getArtistInfo", artistId)
        }
      } catch (e) {
        console.log(e)
      }
    },

    async getArtistInfo(context, artistId) {
      const artistInfo = {}
      try {
        let relatedArtists = await Axios({
          method: "GET",
          url: `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${context.rootState.user.access_token}`
          }
        });
        let topTracks = await Axios({
          method: "GET",
          url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${context.rootState.user.access_token}`
          },
          params: {
            'market': 'US'
          }
        });
        let albums = await Axios({
          method: "GET",
          url: `https://api.spotify.com/v1/artists/${artistId}/albums`,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${context.rootState.user.access_token}`
          }
        });
        artistInfo.relatedArtists = relatedArtists.data;
        artistInfo.topTracks = topTracks.data;
        artistInfo.albums = albums.data;
        context.commit("setArtistInfo", artistInfo);
      }
      catch (e) {
        console.log(e)
      }
    },

    async getRecentlyPlayed(context) {
      try {
        const { data } = await Axios({
          method: "GET",
          url: `https://api.spotify.com/v1/me/player/recently-played`,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${context.rootState.user.access_token}`,
          },
          params: {
            "limit": "20",
          }
        });

        context.commit("setRecentlyPlayed", data);
      } catch (e) {
        console.log(e);
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
    },
    getRecentlyPlayed(state) {
      return state.recently_played;
    },
  },
}
