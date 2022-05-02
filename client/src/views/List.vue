<template>
  <transition name="fade" mode="out-in">
    <div v-if="selectionMade">
      <v-btn absolute @click="onReturnClicked" class="mx-2" small fab
        ><v-icon>mdi-arrow-left</v-icon></v-btn
      >
      <router-view></router-view>
    </div>
    <div v-if="!selectionMade">
      <v-toolbar flat>
        <v-badge color="blue lighten-2" v-bind:content="rows.length" inline>
          <v-toolbar-title>Map list</v-toolbar-title>
        </v-badge>
        <v-spacer></v-spacer>
        <v-btn @click="toggle"> Filters </v-btn>
      </v-toolbar>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        single-select
        @click:row="onSelect"
        :headers="headers"
        :items="rows"
        :search="search"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-1"
        @page-count="pageCount = $event"
        loading="loaded"
        loading-text="Loading... Please wait"
      >
        <template v-slot:[`item.releasedate`]="{ item }">
          {{ formatReleaseDate(item.releasedate) }}
        </template>
        <template v-slot:[`item.size`]="{ item }">
          <v-chip>{{ formatSize(item.size) }}</v-chip>
        </template>
        <template v-slot:[`item.styles`]="{ item }">
          <v-chip
            v-for="style in item.styles"
            :key="style"
            class="ma-1"
            color="success"
            outlined
            >{{ style }}</v-chip
          >
        </template>
      </v-data-table>
      <div class="text-left">
        <v-row no-gutters>
          <v-col cols="11">
            <v-pagination
              v-model="page"
              :length="pageCount"
              total-visible="15"
            ></v-pagination>
          </v-col>
          <v-col cols="1">
            <v-select
              dense
              single-line
              :items="pageOptions"
              :value="itemsPerPage"
              v-model="itemsPerPage"
              label="Item count"
            ></v-select>
          </v-col>
        </v-row>
      </div>
    </div>
  </transition>
</template>

<script>
import { store } from "../main";
import router from "../router/index";
import moment from "moment";

const api = require("../service/api");

export default {
  name: "List",
  components: {},
  data() {
    return {
      pageOptions: [10, 15, 20, 50, 100, 200],
      page: 1,
      search: "",
      pageCount: 0,
      itemsPerPage: 10,
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "map_name",
        },
        { text: "Author", value: "author" },
        { text: "Style", value: "styles" },
        { text: "Version", value: "version" },
        { text: "Released", value: "releasedate" },
        { text: "Size", value: "size" },
      ],
      sharedStore: store.state,
      rows: [],
      loaded: false,
      selectionMade: false,
      returnCall: () => {
        this.selectionMade = false;
      },
    };
  },
  watch: {
    $route(to, from) {
      if (to.name === "List" && from.name === "MapInfo") {
        this.selectionMade = false;
      }
    },
  },
  methods: {
    onSelect(items) {
      this.selectionMade = true;
      router.push("/list/map/" + items.id);
    },
    setRows(rows) {
      this.rows = rows;
      this.loaded = true;
    },
    onReturnClicked() {
      router.push("/list");
      this.selectionMade = false;
    },
    toggle() {
      store.toggleFilterDrawerOpen();
    },
    routeChanged() {
      console.log("|changed routo");
    },
    formatReleaseDate(date) {
      return moment(date, "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DD HH:mm");
    },
    formatSize(bytes) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },
  },
  async mounted() {
    const rows = (await api.fetchMaps()).data;
    this.setRows(rows);
    this.$watch(
      "sharedStore",
      function () {
        api.fetchMaps(this.sharedStore.worldSettings).then((res) => {
          this.setRows(res.data);
        });
      },
      { deep: true }
    );
    /**
     * URL contains a map id. Show map info right away.
     */
    if (this.$route.name === "MapInfo") {
      this.selectionMade = true;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
