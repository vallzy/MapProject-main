<template>
  <div>
    <v-layout row wrap>
      <v-flex>
        <v-card tile max-width="300" flat style="margin: 1rem">
          <v-card-title> Author </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="author"
              label="Enter the map author(s)."
              placeholder="Separate names with comma"
              clearable
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card tile max-width="300" flat style="margin: 1rem">
          <v-card-title> Map style(s) </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-checkbox
                  v-model="mapStyles"
                  value="strafe"
                  label="Strafe"
                ></v-checkbox>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="mapStyles"
                  value="original"
                  label="Original"
                ></v-checkbox>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="mapStyles"
                  value="custom"
                  label="Custom"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card tile max-width="300" flat style="margin: 1rem">
          <v-card-title> Difficulty </v-card-title>
          <v-card-text>
            Mechanical
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
              :value="mechSlider"
              @input="(event) => sliderChange('mechanical', event)"
              ref="slider"
              min="0"
              max="5"
              ticks="always"
              tick-size="2"
              step="0.5"
              track-color="transparent"
              class="difficulty-slider"
            >
            </v-range-slider>
            Strafe
            <v-tooltip left max-width="240">
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="secondary" v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span
                >Strafe difficulty is determined by the ability to gain speed as
                much and as quick as possible</span
              >
            </v-tooltip>
            <v-range-slider
              :tick-labels="difficulty"
              :value="strafeSlider"
              @input="(event) => sliderChange('strafe', event)"
              track-color="transparent"
              ref="slider2"
              min="0"
              max="5"
              ticks="always"
              tick-size="2"
              step="0.5"
            >
            </v-range-slider>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "MapUploadDetails",
  data() {
    return {
      author: "",
      mechSlider: [1, 2],
      strafeSlider: [1, 2],
      mapStyles: [],
      difficulty: ["Easy", "", "", "Medium", "", "", "Hard", "", "", "Insane"],
    };
  },
  methods: {
    submit() {
      const result = {
        author: this.author,
        mechSlider: this.mechSlider,
        strafeSlider: this.strafeSlider,
        mapStyles: this.mapStyles,
        difficulty: this.difficulty,
      };
      console.log(result);
      this.$emit("submitInfo", result);
    },
    cheatSlider(e, ref) {
      let value = ref.parseMouseMove(e);
      if (e.type === "mousemove") {
        ref.thumbPressed = true;
      }
      ref.setInternalValue(value);
    },
    sliderChange(slider, event) {
      if (slider === "strafe") {
        this.strafeSlider = event;
      }

      if (slider === "mechanical") {
        this.mechSlider = event;
      }
    },
  },
  mounted() {
    this.$refs.slider.onMouseMove = (e) => {
      this.cheatSlider(e, this.$refs.slider);
    };
    this.$refs.slider2.onMouseMove = (e) => {
      this.cheatSlider(e, this.$refs.slider2);
    };
  },
};
</script>

<style>
.v-slider__track-container {
  background: linear-gradient(
    90deg,
    rgba(75, 150, 0, 1) 0%,
    rgba(252, 255, 0, 1) 51%,
    rgba(255, 0, 0, 1) 100%
  ) !important;
}
.v-slider__track-background {
  background-color: transparent !important;
}
</style>