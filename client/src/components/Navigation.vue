<template>
  <nav class="navbar spotify-black-background">
    <a class="navbar-img" href="../">
      <img src="../assets/logo.png" />
    </a>
    <div class="navbar-brand">
      <a @click.prevent="viewRecent()" class="navbar-item" v-if="auth" x>
        Recently Played
      </a>
      <router-link to="/playlists" class="navbar-item" v-if="auth"
        >Spotify Playlists</router-link
      >
      <div class="navbar-item field has-addons" v-if="auth">
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Search artist, song, or album"
            v-model="search"
            @keyup.enter="spotifySearch()"
          />
        </div>
        <div class="control">
          <a class="button" @click="spotifySearch"> Search </a>
        </div>
      </div>
      <div class="navbar-burger burger" data-target="navMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="navbar-end" v-if="!auth">
      <a
        class="navbar-item button spotify-green-background is-block is-bold"
        href="https://artistplaylists.herokuapp.com/auth/login"
      >
        Login
      </a>
    </div>
    <div class="navbar-end" v-if="auth">
      <div class="navbar-item dropdown is-hoverable">
        <div class="dropdown-trigger">Hello {{ user.spotify_id }}</div>

        <div class="dropdown-menu">
          <div class="dropdown-content">
            <a href="#" @click.prevent="signOut()"> Sign out </a>
          </div>
        </div>
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
    viewRecent() {
      this.$store.dispatch("getRecentlyPlayed");
      this.$router.push("/recent");
    },
    signOut() {
      this.$cookies.remove("user_token");
      window.location.href = "../";
    },
  },
};
</script>

<style lang="scss" scoped>
input[type="text"] {
  border-radius: 25px;
}
.navbar {
  background: #212121;
  padding: 1rem 2rem 1rem 2rem;
  margin-bottom: 0;

  .navbar-end {
    top: auto;
    align-items: right;
    justify-content: right;
  }

  .navbar-brand {
    padding-left: 10%;
  }

  .navbar-item {
    color: #efefef;

    &:hover {
      color: #1db954;
    }
  }

  .navbar-img img {
    max-width: 150px;
    padding-top: 10px;
  }

  .button {
    background: #1db954;
    border: 0;
    border-radius: 25px;
    color: #212121;
  }
  .field {
    margin-top: 10px;
  }

  .dropdown-menu {
    background: #212121;
    .dropdown-content {
      background: #212121;
      a {
        padding-left: 20px;
        color: #fff;

        &:hover {
          color: #1db954;
        }
      }
    }
  }
}
</style>