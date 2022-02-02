<template>
  <div>Hello! Authenticated!</div>
</template>

<script>
export default {
  beforeMount() {
    this.$store.commit("setCookie", $route.params.token);
    this.$store.tryAutoLogin();
  },
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
      document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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