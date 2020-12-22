<template>
  <nav class="navbar has-shadow spotify-black-background">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="../">
          <img
            src="http://bulma.io/images/bulma-logo.png"
            alt="Bulma: a modern CSS framework based on Flexbox"
          />
        </a>
        <router-link to="/recent" class="navbar-item cwhite"
          >Recently Played</router-link
        >
        <router-link to="/playlists" class="navbar-item"
          >Spotify Playlists</router-link
        >
        <div class="field has-addons">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Search artist, song, or album"
              v-model="search"
            />
          </div>
          <div class="control">
            <a class="button is-info" @click="spotifySearch"> Search </a>
          </div>
        </div>
        {{ search }}
        <div class="navbar-burger burger" data-target="navMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-end" v-if="!auth">
        <a
          class="navbar-item button spotify-green-background is-block is-bold"
          href="http://localhost:5000/login"
        >
          Login
        </a>
      </div>
      <div class="navbar-end" v-if="auth">
        <div class="navbar-item">Hello {{ user.spotify_id }}</div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data: () => {
    return {
      search: "",
    };
  },
  computed: {
    auth() {
      return this.$store.getters.isAuthenticated;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    spotifySearch() {
      if (this.search.length > 0) {
        if (this.search.length > 3) {
          this.$store.commit("setSearchResults", null);
          this.$store.dispatch("getSearchResults", this.search);
          this.search = "";
          this.$router.push("/search");
        }
      }
    },
    openPlaylist() {
      this.$store.dispatch("setActivePlaylist", playlist);
      this.$router.push("/artists/playlist");
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  .navbar-item {
    &:hover {
      color: #1db954;
      background-color: #191414;
    }
  }
}
.navbar-item {
  color: #fff;
  background-color: #191414;
}
.spotify-green-background {
  background: #20a950;
}

.button {
  border: 0;
  transition: background-color 0.5s ease;
  font-size: 14px;
  font-weight: 700;

  &:hover {
    background-color: #1db954;
    color: #fff;
    transition: background-color 0.5s ease;
  }
}
</style>