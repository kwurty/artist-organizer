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
    artistPlaylist: null,
    JWT: null
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
    },
    setJWT(state, jwt) {
      state.JWT = jwt
    }
  },
  actions: {
    async tryAutoLogin(context) {
      let user = await Axios.get(`https://artistplaylists.herokuapp.com/auth/checklogin`, {
        params: {
          token: context.getters.JWT
        }
      });
      if (user.spotify_id !== null) {
        context.commit('setUser', user.data);
        context.commit('setAuthed', true);
        context.dispatch('tryPlaylistGather');
      }
    },
    async setJWT(context, payload) {
      context.commit("setJWT", payload)
    },
    async tryPlaylistGather(context) {
      console.log('trying gather');
      let token = context.getters.JWT;

      Axios.get('https://artistplaylists.herokuapp.com/artist/playlists', {
        params: {
          token
        }
      }).then((res, err) => {
        if (err) return console.log(err)
        context.dispatch('setArtistPlaylists', res.data);

      })
    },
    setArtistPlaylist(context, payload) {
      context.dispatch('setArtistPlaylist', payload)
    },
    async getArtistPlaylist(context, payload) {
      let playlist = await Axios.get(`https://artistplaylists.herokuapp.com/artist/playlist`, {
        params: {
          id: payload,
          token: context.getters.JWT
        },
      });
      if (playlist.data != null) {
        context.commit('setArtistPlaylist', playlist.data)
      }
    },
    async createArtistPlaylist(context, payload) {
      let token = await context.getters.JWT;
      // let params = new URLSearchParams();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("name", payload);
      urlencoded.append("token", token);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      fetch("https://artistplaylists.herokuapp.com/artist/playlist", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));



      // params.append('token', token);
      // params.append('name', payload);
      // let newPlaylist = await (Axios.post(`https://artistplaylists.herokuapp.com/artist/playlist`), params)
      // // let newPlaylist = await Axios.post(`https://artistplaylists.herokuapp.com/artist/playlist`, {
      // //   name: payload,
      // //   token: context.getters.JWT
      // // });
      // if (newPlaylist != null) {
      //   // context.dispatch('tryPlaylistGather');
      // }
      // }
    },
    setArtistPlaylists(context, payload) {
      context.commit('setArtistPlaylists', payload)
    },
    async addArtistToPlaylist(context, payload) {
      let token = await context.getters.JWT;
      // let params = new URLSearchParams();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("name", payload);
      urlencoded.append("token", token);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      fetch("https://artistplaylists.herokuapp.com/artist/playlist", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
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
    },
    JWT(state) {
      return state.JWT;
    }
  },
  modules: {
    spotify
  }
});
