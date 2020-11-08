import { createStore } from "vuex";
import Axios from 'axios';
require('dotenv').config()

export default createStore({
  state: {
    idToken: null,
    userId: null,
    user: null
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
    }
  },
  actions: {
    tryAutoLogin(context) {
      console.log("trying");
      Axios.get(`${process.env.VUE_APP_BACKEND_URI}dbtest`)
      .then(results => {
        context.commit('tempStore', (results.data))
      })
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.idToken !== null;
    }
  },
  modules: {}
});
