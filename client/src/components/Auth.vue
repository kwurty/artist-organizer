<template>
  <div></div>
</template>

<script>
export default {
  beforeMount() {
    if (this.$route.query.token) {
      this.$store.commit("setJWT", this.$route.query.token);
      this.$cookies.set("user_token", this.$route.query.token);
      this.$store.dispatch("tryAutoLogin");
      window.location.href = "../";
    }
  },
};
</script>