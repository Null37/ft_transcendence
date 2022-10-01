<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data: () => ({
      drawer: null,
      //loginLink: "http://"+process.env.VUE_APP_HOSTIP+":"+process.env.VUE_APP_BACKPORT+"/Login" as string,
      loginLink: "http://localhost:3000/Login" as string,
    }),
});
</script>

<template>
  <v-app id="inspire">
   <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <div class="text-center">
              <a v-bind:href=loginLink>
                <v-btn
                color="white"
                class="black--text"
                x-large
                >
                  <v-avatar
                      size="36"
                      tile
                      left
                  >
                      <img
                      :elevation="2"
                      alt="Avatar"
                      src="../assets/logo.png"
                      >
                  </v-avatar>

                  Login
                  </v-btn>
                </a>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>