<template>
  <main v-bind:class="{ background: !auth }">
    <div v-if="auth" class="logged">Welcome back!</div>
    <div v-else class="notlogged">
      <span> Looking for an alternative way to organize your music? </span>

      <span> Move artists into their own categories. </span>
      <span> Never forget that newly discovered band! </span>
    </div>
  </main>
</template>

<script>
// import Axios from "axios";
export default {
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
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
main {
  font-size: 2em;
  padding: 45px;
  height: 100%;
  width: 100%;
  background-position: right bottom;
  background-repeat: no-repeat;
  background-blend-mode: saturation;

  .background {
    background-image: linear-gradient(#292b2d, #292b2d),
      url("../assets/guitarist.png");
  }
  .notlogged {
    display: flex;
    flex-direction: column;
    span {
      padding: 20px;

      &:nth-child(even) {
        color: #1db954;
      }
    }
  }
}
</style>
