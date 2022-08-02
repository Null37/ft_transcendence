<script lang="ts">
  export default {
    data: () => ({
      selectedItem: 1,
      items: [
        {status: 'Online', text: 'Real-Time', icon: 'mdi-clock' },
        {status: 'Offline', text: 'Audience', icon: 'mdi-account' },
        {status: 'In-Game', text: 'Conversions', icon: 'mdi-flag' },
      ],
    }),
  }
</script>

<template>
    <v-navigation-drawer
      app
      clipped
      right
    >
      <v-list dense>
      <v-subheader>REPORTS</v-subheader>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          link
        >
          <v-list-item-icon>

            <v-icon color="primaty" v-text="item.icon"></v-icon>
            <v-badge
              bottom
              color="success"
              dot
            ></v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
    </v-list>
    </v-navigation-drawer>
</template>