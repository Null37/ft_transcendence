<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data: () => ({drawer: null})
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
              <a href="http://localhost:3000/profile">
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