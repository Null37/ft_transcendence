<script lang="ts">
import UserMenu from "./UserMenu.vue";
import axios from 'axios';
export default {
  props: ['username', 'users', 'friends'],
  data: () => ({
      
      selectedItem: 1,
  }),
  mounted() {
    
  },
  methods: {
    removefriendC: function(username: string)
    {
      this.$emit('removefriend', username)
    },
    AddfriendC: function(username: string)
    {
      this.$emit('Addfriend', username)
    }
  },
  components: { UserMenu }
}
</script>

<template>
    <v-navigation-drawer
      app
      clipped
      right
    >
      <v-list dense>
      <v-subheader>Friends</v-subheader>
        <v-list-item
          v-for="friend in friends"
          :key="friend.id"
          link
        >
          <UserMenu @removefriend="removefriendC" :status="'friend'"  :user="friend" />
        </v-list-item>
    </v-list>
    <v-list dense>
      <v-subheader>Users</v-subheader>
        
        <v-list-item
          v-for="user in users"
          :key="user.id"
          v-if="user.username !== username && user.username !== null"
          link
        >
          <UserMenu @Addfriend="AddfriendC" :status="'user'" :user="user" />
        </v-list-item>
    </v-list>
    </v-navigation-drawer>
</template>