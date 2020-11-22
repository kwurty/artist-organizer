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
        <router-link to="/artists" class="navbar-item cwhite"
          >View Artistlists</router-link
        >
        <router-link to="/playlists" class="navbar-item"
          >View Playlists</router-link
        >
        <router-link to="/search" class="navbar-item"
          >Search For Artists</router-link
        >

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
  <!-- <nav class="navbar is-white">
    <div class="container">
        <div class="navbar-brand">
            <router-link calss="navbar-item brand-text" to="/">ADMIN</router-link>
            <div class="navbar-burger burger" data-target="navMenu">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div class="navbar-start">
            <router-link to="/artists" class="navbar-item">View Artistlists</router-link>
            <router-link to="/playlists" class="navbar-item">View Playlists</router-link>
            <router-link to="/search" class="navbar-item">Search For Artists</router-link>
        </div>
    </div>
</nav> -->
</template>

<script>
export default {
  computed: {
    auth() {
      return this.$store.getters.isAuthenticated;
    },
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.$store.dispatch("tryAutoLogin");
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