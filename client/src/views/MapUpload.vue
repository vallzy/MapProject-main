<template>
  <v-stepper v-model="progress">
    <v-stepper-header>
      <v-stepper-step :complete="progress > 1" step="1">
        Upload map file
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :editable="progress > 1"
        :complete="progress > 2"
        step="2"
      >
        Verify parsed information
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :editable="progress > 1" step="3">
        Categorize map
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-alert dense outlined type="error" v-if="uploadError">
          {{ uploadError }}
        </v-alert>
        <v-form
          ref="uploadForm"
          id="uploadForm"
          action="http://localhost:3000/api/upload"
          method="post"
          encType="multipart/form-data"
        >
          <v-file-input
            accept="*/*"
            name="map"
            label="File input"
            v-model="fileUpload"
          ></v-file-input>
          <v-btn @click="submitUpload" color="primary">CONTINUE</v-btn>
        </v-form>
      </v-stepper-content>

      <v-stepper-content step="2">
        <map-parse-preview :mapInfo="mapResponse"></map-parse-preview>

        <v-btn color="primary" @click="progress = 3"> Continue </v-btn>

        <v-btn text> Cancel </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <map-upload-details
          ref="classificationDetails"
          @submitInfo="submitMapClassification"
        ></map-upload-details>

        <v-btn color="primary" @click="submitClassificationClicked">
          Finish
        </v-btn>

        <v-btn text> Cancel </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { upload, submitClassification } from "../service/api";
import MapUploadDetails from "./MapUploadDetails.vue";
import MapParsePreview from "./MapParsePreview.vue";
import router from "../router/index";

export default {
  components: { MapUploadDetails, MapParsePreview },
  name: "MapUpload",
  data: () => ({
    progress: 1,
    fileUpload: [],
    uploadError: null,
    mapResponse: null,
  }),
  methods: {
    submitUpload() {
      this.uploadError = null;
      let formData = new FormData();
      formData.append("map", this.fileUpload);

      upload(formData)
        .then((res) => {
          console.log(res);
          this.mapResponse = res.data;
          this.progress = 2;
        })
        .catch((err) => {
          this.uploadError = err.response.data;
        });
    },
    submitClassificationClicked() {
      this.$refs.classificationDetails.submit();
    },
    submitMapClassification(classification) {
      classification.mapId = this.mapResponse.uploadedInfo.id;
      submitClassification(classification).then(() => {
        router.push("/map/" + classification.mapId);
      });
    },
  },
};
</script>

<style>
</style>