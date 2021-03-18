<template>
  <app-navigation> </app-navigation>
  <div class="columns" id="mail-app">
    <app-side-navigation></app-side-navigation>
    <div class="column router hero is-fullheight">
      <router-view :key="$route.path"> </router-view>
    </div>
  </div>
</template>

<style>
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
    this.$store.dispatch("tryAutoLogin");
    this.$store.dispatch("tryPlaylistGather");
  },
};
</script>