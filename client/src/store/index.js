import { createStore } from "vuex";
import Axios from 'axios';
import spotify from './modules/spotify';

require('dotenv').config()

export default createStore({
  state: {
    idToken: null,
    userId: null,
    user: null,
    isAuthenticated: false
  },
  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    storeUser(state, user) {
      state.user = user;
    },
    tempStore(state, user) {
      state.user = user
    },
    clearAuthData(state) {
      state.idToken = null;
      state.userId = null;
    },
    setAuthed(state, status) {
      state.isAuthenticated = status
    }
  },
  actions: {
    async tryAutoLogin(context) {
      let user = await Axios.get(`${process.env.VUE_APP_BACKEND_URI}/checklogin`, { withCredentials: true });
      if (user.spotify_id !== null) {
        context.commit('storeUser', user.data);
        context.commit('setAuthed', true);
      }
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    }
  },
  modules: {
    spotify
  }
});
