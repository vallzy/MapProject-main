import Vue from 'vue'
import App from './App.vue'
import mapview from './views/MapView.vue'
import updetails from './views/MapUploadDetails'
import router from './router'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)
export const store = {
  state: {
    filterDrawerOpen: false,
    worldSettings: [
      "nosave",
      "nonoclip",
      "nofeatures",
      "nojumpdelay",
      "noexplosives",
      "nogoto",
      "nooverbounce",
      "none",
      "timerun",
      "portalgun",
      "movers",
      "pushers",
    ],
    authenticated: false,
    role: ''
  },
  toggleFilterDrawerOpen() {
    this.state.filterDrawerOpen = !this.state.filterDrawerOpen;
  },
  setAuthenticated(authStatus, role) {
    this.state.authenticated = authStatus;
    this.state.role = role;
  }
}

Vue.component("mapview", mapview)
Vue.component("updetails", updetails)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
