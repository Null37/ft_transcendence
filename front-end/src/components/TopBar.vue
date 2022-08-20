<template>
    <v-app-bar
      app
      clipped-right
      flat
      height="72"
    >
      <v-spacer>
        <div class="text-lg-h6">
          
          <v-icon
          
          color="grey"
          >mdi-pound</v-icon>

          {{title}}
        </div>
      </v-spacer>

    </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: "App",
    props: ['title'],
    data: () => ({
        drawer: null
    })
});
</script>