<template>
  <v-app>
    <v-app-bar
      fixed
      dark
      app
      src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
    >
      <v-img
        lazy-src="@/assets/title-logo.png"
        max-height="64"
        max-width="64"
        src="@/assets/title-logo.png"
      ></v-img>
      <v-toolbar-title class="app-title">ET Map database</v-toolbar-title>
      <v-tabs right>
        <v-tab flat to="/">Home</v-tab>
        <v-tab flat to="/list">TRICKJUMP MAPS</v-tab>
        <v-tab flat to="/list">FPS MAPS</v-tab>
        <v-tab flat to="/communities">Communities</v-tab>
        <v-tab flat to="/about">About</v-tab>
        <v-tab flat to="/upload" v-if="sharedStore.authenticated"
          ><v-icon>upload</v-icon></v-tab
        >
        <v-tab flat to="/login" v-if="!sharedStore.authenticated"
          ><v-icon>login</v-icon></v-tab
        >
      </v-tabs>
    </v-app-bar>

    <v-navigation-drawer
      v-model="sharedStore.filterDrawerOpen"
      temporary
      dark
      app
      absolute
      right
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Worldspawn keys</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="filt in filters" :key="filt.value">
          <v-switch
            multiple
            v-model="sharedStore.worldSettings"
            :label="filt.display"
            color="success"
            :value="filt.value"
            hide-details
          ></v-switch>
        </v-list-item>
        <v-list-item> </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Map features</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="feat in features" :key="feat.value">
          <v-switch
            multiple
            v-model="sharedStore.worldSettings"
            :label="feat.display"
            color="success"
            :value="feat.value"
            hide-details
          ></v-switch>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { store } from "./main";
import { parseJwt } from "./service/utils";

export default {
  name: "App",
  data() {
    return {
      sharedStore: store.state,
      filters: [
        { display: "No features", value: "nofeatures" },
        { display: "No save", value: "nosave" },
        { display: "No clip", value: "nonoclip" },
        { display: "No overbounce", value: "nooverbounce" },
        { display: "No goto", value: "nogoto" },
        { display: "No jump delay", value: "nojumpdelay" },
        { display: "No explosives", value: "noexplosives" },
        { display: "None", value: "none" },
      ],
      features: [
        { display: "Timerun", value: "timerun" },
        { display: "Portalgun", value: "portalgun" },
        { display: "Movers", value: "movers" },
        { display: "Pushers", value: "pushers" },
      ],
    };
  },
  methods: {
    isPath(path) {
      console.log(this.$route.path);
      return this.$route.path === path;
    },
  },
  mounted() {
    let token = window.localStorage.getItem("jwt");
    if (token) {
      let parsed = parseJwt(token);
      if (parsed.exp > Math.floor(Date.now() / 1000)) {
        store.setAuthenticated(true, parsed.role);
      }
    }
  },
};
</script>

<style lang="scss">
.app-title {
  text-overflow: clip !important;
  overflow: visible !important;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.et-text {
  text-shadow: 1px 1px #000000;
}
</style>
