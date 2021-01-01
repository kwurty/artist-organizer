<template>
  <div class="hello">
    <div v-if="auth" class="welcome">
      Hello {{ user.display_name }}

      <input v-model="playlistName" />
      <button @click.prevent="newPlaylist">Create Playlist</button>
      <br />
      {{ results }}
    </div>
    <p v-else>Please login to use application</p>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  name: "HelloWorld",
  data() {
    return {
      playlistName: "",
      results: "",
    };
  },
  props: {
    msg: String,
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
    async newPlaylist() {
      let response = await Axios.post(
        `${process.env.VUE_APP_BACKEND_URI}/artist/playlist`,
        {
          name: this.playlistName,
        },
        {
          withCredentials: true,
        }
      );
      this.results = response;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
