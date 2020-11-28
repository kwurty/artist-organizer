import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue"
import Artists from "../views/Artists.vue"
import Playlists from "../views/Playlists.vue"
import Search from "../views/Search.vue"
import Playlist from '../components/SpotifyPlaylist.vue'
import Helloworld from "../components/HelloWorld.vue"
const routes = [
  {
    path: "/",
    name: "Home",
    component: Helloworld
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
    path: "/artists",
    name: "Artists",
    component: Artists
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
