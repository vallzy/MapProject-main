<template>
  <div>
    <v-toolbar dense class="elevation-0">
      <v-toolbar-title>{{ mapInfo.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="subtitle-1">Release date {{ mapInfo.release }}</div>
    </v-toolbar>

    <v-layout row wrap>
      <v-flex xs4>
        <!-- Arena info card -->
        <v-card flat style="margin: 1rem" class="grey lighten-1" round="l">
          <v-card-title>Arena info</v-card-title>
          <v-card-text color="grey lighten-1">
            <div class="pb-2 text--primary">
              <strong>Long name: </strong>
              <span v-html="textToColor(mapInfo.arena.longname)"></span>
            </div>

            <div class="pb-2 text--primary">
              <strong>Briefing</strong>
              <div v-html="textToColor(mapInfo.arena.briefing)"></div>
            </div>

            <div class="pb-2 text--primary">
              <strong>Timelimit</strong>
              {{ mapInfo.arena.timelimit }}
              <strong>Axis respawn</strong>
              {{ mapInfo.arena.axisRespawnTime }}
              <strong>Allied respawn</strong>
              {{ mapInfo.arena.alliedRespawnTime }}
            </div>

            <div class="pb-2 text--primary">
              <strong>Type</strong>
              {{ mapInfo.arena.type }}
            </div>

            <div>
              <v-chip
                v-for="ws in mapInfo.worldspawns"
                :key="ws"
                class="ma-1"
                color="success"
                outlined
                >{{ ws }}</v-chip
              >
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <!-- Levelshots -->
      <v-flex xs4>
        <v-card style="margin: 1rem" flat class="grey lighten-1" round="l">
          <v-card-title>Levelshots</v-card-title>
          <v-card-text color="grey lighten-1">
            <v-card class="mb-2">
              <v-img
                :src="apiRoot + '/api/img/' + mapInfo.uploadedInfo.levelshot"
              ></v-img>
              <v-card-title class="text-h7">Levelshot</v-card-title>
            </v-card>
            <v-card class="mb-2">
              <v-img
                :src="apiRoot + '/api/img/' + mapInfo.uploadedInfo.levelshotcc"
              ></v-img>
              <v-card-title class="text-h7">CC Levelshot</v-card-title>
            </v-card>
          </v-card-text>
        </v-card>
      </v-flex>

      <!-- Files -->
      <v-flex xs4>
        <v-card style="margin: 1rem" flat class="grey lighten-1" round="l">
          <v-card-title>Files</v-card-title>
          <v-card-text color="grey lighten-1">
            <v-treeview :items="mapInfo.fileTree.filetree">
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="item.type == 'directory'">{{
                  open ? "mdi-folder-open" : "mdi-folder"
                }}</v-icon>
                <v-icon v-else>mdi-file-document-outline</v-icon>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { textToColor } from "../service/utils";
import { apiRoot } from "../service/api";

export default {
  name: "MapParsePreview",
  props: {
    mapInfo: {
      type: Object,
    },
    apiRoot: {
      type: String,
      default: apiRoot,
    },
  },
  data() {
    return {
      tab: "general",
    };
  },
  methods: {
    onSubmit(data) {
      this.$emit("confirm", data);
    },
    textToColor,
  },
};
</script>

<style>
</style>