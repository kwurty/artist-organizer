<template>
  <app-navigation> </app-navigation>
  <div class="columns" id="mail-app">
    <app-side-navigation></app-side-navigation>
    <div class="column router hero is-fullheight">
      <router-view> </router-view>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.router {
  display: block;
  background-color: #fff;
  border-right: 1px solid #dedede;
  padding: 40px 20px;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
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
    this.$store.dispatch("tryAutoLogin");
  },
};
</script>