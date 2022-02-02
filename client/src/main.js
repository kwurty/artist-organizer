import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCookies from 'vue-cookies';

App.use(VueCookies);

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
