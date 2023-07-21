/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
// Composables
import {createApp} from 'vue'
import Keycloak from 'keycloak-js'
import securityStore from "@/vuex/SecurityStore";

// Components
import App from './App.vue'

// Plugins
import {registerPlugins} from '@/plugins'
import router from "@/router";
import eventBus from "@/vuex/EventBus";


const app = createApp(App);
app.config.globalProperties.$eventBus = eventBus;
registerPlugins(app);

const kcAddr = import.meta.env.VITE_KEYCLOAK_ADDRESS;

let initOptions = {
  url: kcAddr + '/auth',
  realm: 'operations-portal-realm',
  clientId: 'op-fe-client',
  onLoad: 'login-required',
}
let keycloak = new Keycloak(initOptions);

securityStore.dispatch('setKeycloak', keycloak);

keycloak.init({
  onLoad: initOptions.onLoad,
  checkLoginIframe: false
}).then((auth) => {

  if (!auth) {
    window.location.reload();
  } else {
    console.log("Authentication success!");
  }
  // TODO: Maybe dont store the token in the localstore, rather use it direct from the keycloak.token object
  localStorage.setItem("vue-token", keycloak.token);
  localStorage.setItem("vue-refresh-token", keycloak.refreshToken);

  app.mount("#app");
  app.use(router);
  securityStore.dispatch('isAdmin');
  securityStore.dispatch('isEmployee');

  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        localStorage.setItem("vue-token", keycloak.token);
      }
    }).catch(() => {
      console.log('Failed to refresh token');
    });
  }, 60000)

}).catch(() => {
  console.log("Authenticated Failed");
});






