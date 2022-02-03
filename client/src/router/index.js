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
    path: "/login",
    component: Login
  },
  {
    path: "/playlists",
    component: Playlists
  },
  {
    path: "/playlists/tracks",
    component: Playlist
  },
  {
    path: "/artistplaylists/:id",
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
    component: Recent
  },
  {
    path: "/search",
    component: Search
  },
  {
    path: "/artist",
    component: Artist
  },
  {
    path: "/auth",
    props: true,
    component: Auth
  },
  {
    path: "",
    component: Home,

  },
];

const router = createRouter({
  mode: 'history',
  history: routerHistory,
  routes
});

export default router;
