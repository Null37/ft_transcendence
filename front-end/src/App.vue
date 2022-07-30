<script lang="ts">
import Vue from 'vue';
import TopBar from './views/TopBar.vue';
import UserAvatar from './views/UserAvatar.vue';
import FriendList from './views/FriendList.vue';
import ChannelList from './views/ChannelList.vue';

export default Vue.extend({
    name: "App",
    data: () => ({
        drawer: null
    }),
    components: { TopBar, UserAvatar, FriendList, ChannelList }
});
</script>


<template>
   <v-app id="inspire">
    <TopBar />

    <v-navigation-drawer
      v-model="drawer"
      app
      width="300"
    >
      <UserAvatar />

      <v-sheet
        height="128"
        width="100%"
      ></v-sheet>
      <FriendList />
    </v-navigation-drawer>

    <ChannelList />
    <v-main>
       <!-- Chat Window -->
    </v-main>

    <v-footer
      app
      color="transparent"
      height="72"
      inset
    >
      <v-text-field
        dense
        flat
        hide-details
        rounded
        solo
      ></v-text-field>
    </v-footer>
    
  </v-app>
</template>


