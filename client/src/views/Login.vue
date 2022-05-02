<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-text>
      Admin Login
      <v-snackbar v-model="snackbar">
        Login succesful
        <template v-slot:action="{ attrs }">
          <v-btn color="green" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <form>
        <v-text-field
          v-model="username"
          :error-messages="usernameErrors"
          :counter="16"
          label="Username"
          autocomplete="username"
          required
          @input="$v.username.$touch()"
          @blur="$v.username.$touch()"
        ></v-text-field>
        <v-text-field
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          v-model="password"
          :items="password"
          :error-messages="passwordErrors"
          label="Password"
          autocomplete="current-password"
          required
          @change="$v.password.$touch()"
          @blur="$v.password.$touch()"
          @click:append="showPass = !showPass"
        ></v-text-field>
        <v-alert dense outlined type="error" v-if="loginError">
          {{ loginError }}
        </v-alert>
        <v-btn class="mr-4" color="primary" @click="submit"> Login </v-btn>
        <v-btn @click="clear"> clear </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import { login } from "../service/api";
import { store } from "../main";
import router from "../router/index";
import { parseJwt } from "../service/utils";

export default {
  name: "Login",
  mixins: [validationMixin],

  validations: {
    username: { required, maxLength: maxLength(16) },
    password: { required, maxLength: maxLength(64) },
  },
  data: () => ({
    username: "",
    password: "",
    showPass: false,
    loginError: null,
    snackbar: false,
  }),
  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.maxLength &&
        errors.push("Password must be at most 64 characters long");
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.maxLength &&
        errors.push("Username must be at most 16 characters long");
      !this.$v.username.required && errors.push("Username is required.");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
      login(this.username, this.password)
        .then((value) => {
          if (value.data.token) {
            window.localStorage.setItem("jwt", value.data.token);
            this.loginError = null;
            store.setAuthenticated(true, parseJwt(value.data.token).role);
            this.snackbar = true;
            setTimeout(() => {
              router.push("/");
            }, 1200);
          }
        })
        .catch((err) => {
          console.log(err);
          this.loginError = err.response.data;
        });
    },
    clear() {
      this.$v.$reset();
      this.username = "";
      this.password = "";
      this.showPass = false;
      this.loginError = null;
    },
  },
};
</script>

<style>
</style>