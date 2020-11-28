import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue"
import Recent from "../views/RecentlyPlayed.vue"
import Playlists from "../views/Playlists.vue"
import Search from "../views/Search.vue"
import Playlist from '../components/SpotifyPlaylist.vue'
import Home from "../components/Home.vue"
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
    path: "/recent",
    name: "Recently Played",
    component: Recent
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
