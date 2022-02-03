<template>
  <app-navigation> </app-navigation>
  <div class="columns" id="mail-app">
    <app-side-navigation></app-side-navigation>
    <div class="column router hero is-fullheight color">
      <router-view :key="$route.path"> </router-view>
    </div>
  </div>
</template>

<style>
.color {
  background: #292b2d;
}
* {
  font-family: "Montserrat", sans-serif;
  color: #fff;
}
</style>

<script>
import Navigation from "./components/Navigation.vue";
import SideNavigation from "./components/SideNavigation.vue";
export default {
  data() {},
  components: {
    appNavigation: Navigation,
    appSideNavigation: SideNavigation,
  },
  mounted() {
    let d = this.$cookies.get("user_token");
    if (d) {
      this.$store.dispatch("setJWT", d);
      this.$store.dispatch("tryAutoLogin");
      this.$store.dispatch("tryPlaylistGather");
    }
  },
};
</script>