<script>
import axios from 'axios';
  export default {
    props: ['friends'],
    data: () => ({
    }),
    methods: {

    },
  }
</script>

<template>
    <v-list
        class="pl-14"
        shaped
      >
        <v-list-item
          v-for="f in friends"
          :key="f.id"
          link
        >
          <v-list-item-content @click="$emit('ShowChatMessages', f.username)">
            <v-list-item-title>{{ f.username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
</template>

