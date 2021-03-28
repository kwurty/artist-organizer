import { createStore } from "vuex";
import Axios from 'axios';
import spotify from './modules/spotify';

require('dotenv').config()

export default createStore({
  state: {
    idToken: null,
    userId: null,
    user: null,
    isAuthenticated: false,
    artistPlaylists: null,
    artistPlaylist: null
  },
  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearAuthData(state) {
      state.idToken = null;
      state.userId = null;
    },
    setAuthed(state, status) {
      state.isAuthenticated = status
    },
    setArtistPlaylists(state, playlists) {
      state.artistPlaylists = playlists;
    },
    setArtistPlaylist(state, playlist) {
      state.artistPlaylist = playlist;
    }
  },
  actions: {
    async tryAutoLogin(context) {
      let user = await Axios.get(`${process.env.VUE_APP_BACKEND_URI}/checklogin`, { withCredentials: true });
      if (user.spotify_id !== null) {
        context.commit('setUser', user.data);
        context.commit('setAuthed', true);
      }
    },
    async tryPlaylistGather(context) {
      let playlists = await Axios.get(`${process.env.VUE_APP_BACKEND_URI}/artist/playlists`, { withCredentials: true });
      if (playlists.data != null) {
        context.commit('setArtistPlaylists', playlists.data);
      }
    },
    setArtistPlaylist(context, payload) {
      context.commit('setArtistPlaylist', payload)
    },
    async getArtistPlaylist(context, payload) {
      let playlist = await Axios.get(`${process.env.VUE_APP_BACKEND_URI}/artist/playlist`, {
        params: {
          id: payload
        },
        withCredentials: true
      });
      if (playlist.data != null) {
        context.commit('setArtistPlaylist', playlist.data)
      }
    },
    async createArtistPlaylist(context, payload) {
      let newPlaylist = await Axios.post(`${process.env.VUE_APP_BACKEND_URI}/artist/playlist`, { name: payload }, { withCredentials: true });
      if (newPlaylist != null) {
        context.dispatch('tryPlaylistGather');
      }
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    artistPlaylists(state) {
      return state.artistPlaylists;
    },
    artistPlaylist(state) {
      return state.artistPlaylist;
    }
  },
  modules: {
    spotify
  }
});
