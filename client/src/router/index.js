import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue"
import Recent from "../views/RecentlyPlayed.vue"
import Playlists from "../views/Playlists.vue"
import Search from "../views/Search.vue"
import Playlist from '../components/SpotifyPlaylist.vue'
import Home from "../components/Home.vue"
import ArtistPlaylist from "../components/ArtistPlaylist"
import Artist from "../components/Artist.vue"
import Auth from "../components/Auth.vue"
import Store from "../store/index.js"
const routerHistory = createWebHistory()

const routes = [

  {
    path: "/:catchAll(.*)",
    component: Home
  },
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/playlists",
    name: "Playlists",
    component: Playlists
  },
  {
    path: "/playlists/tracks",
    name: "PlaylistTracks",
    component: Playlist
  },
  {
    path: "/artistplaylists/:id",
    name: "ArtistPlaylist",
    component: ArtistPlaylist,

    // eslint-disable-next-line no-unused-vars
    beforeRouteEnter: (to, from, next) => {
      const id = to.params.id;
      Store.dispatch("getArtistPlaylist", id);
      next()
    }
  },
  {
    path: "/recent",
    name: "Recently Played",
    component: Recent
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: "/artist",
    name: "Artist",
    component: Artist
  },
  {
    auth: "/auth",
    name: "Auth",
    component: Auth
  }
];

const router = createRouter({
  mode: 'history',
  history: routerHistory,
  routes
});

export default router;
