<template>
  <div>
    <v-toolbar dense class="elevation-0">
      <v-toolbar-title>{{ map.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="map.releasedate" class="subtitle-1">
        Released on {{ formatDate(map.releasedate) }}
      </div>
    </v-toolbar>

    <v-layout row wrap>
      <!-- Levelshots -->
      <v-flex xs4 v-if="map.images && map.images.length > 0">
        <v-card style="margin: 1rem" flat class="grey lighten-1" round="l">
          <v-card-title class="d-flex justify-space-between"
            >Gallery
            <span>{{ getImageName(selectedImage) }} </span></v-card-title
          >
          <v-card-text color="grey lighten-1">
            <v-card class="mb-2">
              <v-carousel v-model="selectedImage">
                <v-carousel-item
                  v-for="(item, i) in map.images"
                  :key="i"
                  :src="apiRoot + '/api/img/' + item.original_name"
                ></v-carousel-item>
              </v-carousel>
            </v-card>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs4>
        <!-- Arena info card -->
        <v-card flat style="margin: 1rem" class="grey lighten-1" round="l">
          <v-card-title>Arena info</v-card-title>
          <v-card-text color="grey lighten-1">
            <div class="pb-2 text--primary">
              <strong>Long name: </strong>
              <span v-html="map && textToColor(map.map_longname)"></span>
            </div>

            <div class="pb-2 text--primary">
              <strong>Briefing</strong>
              <div v-html="map && textToColor(map.map_briefing)"></div>
            </div>

            <div class="pb-2 text--primary">
              <strong>Timelimit</strong>
              {{ map.map_timelimit }}
              <strong>Axis respawn</strong>
              {{ map.map_axisRespawnTime }}
              <strong>Allied respawn</strong>
              {{ map.map_alliedRespawnTime }}
            </div>

            <div class="pb-2 text--primary">
              <strong>Type</strong>
              {{ map.map_type }}
            </div>

            <div>
              <v-chip
                v-for="ws in map.worldspawns"
                :key="ws"
                class="ma-1"
                color="success"
                outlined
                >{{ ws }}</v-chip
              >
            </div>
          </v-card-text>
        </v-card>

        <!-- Map rating card -->
        <v-card flat style="margin: 1rem" class="grey lighten-1" round="l">
          <v-card-title>Map classification</v-card-title>
          <v-card-text color="grey lighten-1">
            <div class="pb-2 text--primary">
              <strong>Author: </strong>
              <span v-html="map && textToColor(map.author)"></span>
            </div>

            <div class="pb-2 text--primary">
              <strong>Styles:</strong>
              <v-chip
                v-for="style in map.styles"
                :key="style"
                class="ma-1"
                color="success"
                outlined
                >{{ style }}</v-chip
              >
            </div>

            <div class="pb-2 text--primary">
              <div>
                <strong>Mechanical</strong>
                <v-tooltip left max-width="240">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="secondary" v-bind="attrs" v-on="on">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  <span
                    >Mechanical difficulty is determined by knowledge of various
                    movement mechanics, as well as ability to execute them
                    precisely</span
                  >
                </v-tooltip>
                <v-range-slider
                  :tick-labels="difficulty"
                  :value="mechanicalSlider"
                  ref="slider"
                  min="0"
                  max="5"
                  ticks="always"
                  tick-size="2"
                  step="0.5"
                  track-color="transparent"
                  class="difficulty-slider disabled-slider"
                >
                </v-range-slider>
                <strong>Strafe</strong>
                <v-tooltip left max-width="240">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="secondary" v-bind="attrs" v-on="on">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  <span
                    >Strafe difficulty is determined by the ability to gain
                    speed as much and as quick as possible</span
                  >
                </v-tooltip>
                <v-range-slider
                  class="disabled-slider"
                  :tick-labels="difficulty"
                  :value="strafeSlider"
                  track-color="transparent"
                  ref="slider2"
                  min="0"
                  max="5"
                  ticks="always"
                  tick-size="2"
                  step="0.5"
                >
                </v-range-slider>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <!-- Files -->
      <v-flex xs4>
        <v-card style="margin: 1rem" flat class="grey lighten-1" round="l">
          <v-card-title>Contents</v-card-title>
          <v-card-text color="grey lighten-1">
            <v-treeview
              v-if="map.filetree && map.filetree.filetree"
              :items="map.filetree.filetree"
            >
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
import moment from "moment";

const api = require("../service/api");

export default {
  name: "mapview",
  props: {
    apiRoot: {
      type: String,
      default: apiRoot,
    },
  },
  data() {
    return {
      map: {},
      strafeSlider: [],
      mechanicalSlider: [],
      difficulty: ["Easy", "", "", "Medium", "", "", "Hard", "", "", "Insane"],
      selectedImage: 0,
    };
  },
  async mounted() {
    const result = (await api.fetchMap(this.$route.params.id)).data;
    this.setMap(result);
  },
  methods: {
    setMap(map) {
      this.map = map;
      this.strafeSlider = [map.strafe_low, map.strafe_high];
      this.mechanicalSlider = [map.mechanical_low, map.mechanical_high];
    },
    textToColor,
    formatDate(date) {
      const newDate = moment(date);
      return newDate.format("MMMM d, YYYY");
    },
    getImageName(imgIndex) {
      if (this.map.images[imgIndex]) {
        if (this.map.images[imgIndex].levelshot_type === "default") {
          return "Levelshot";
        } else if (this.map.images[imgIndex].levelshot_type === "cc") {
          return "CC Levelshot";
        } else {
          return this.map.images[imgIndex].original_name;
        }
      }

      return "";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.disabled-slider {
  pointer-events: none;
}
</style>
