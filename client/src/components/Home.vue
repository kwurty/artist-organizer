<template>
  <div class="hello">
    <div v-if="auth" class="welcome">
      Hello {{user.display_name}}
    </div>
    <p v-else>
      Please login to use application
    </p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
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
