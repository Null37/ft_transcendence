<script lang="ts">
import UserMenu from "./UserMenu.vue";
import axios from 'axios';
export default {
  props: ['username'],
  data: () => ({
      
      selectedItem: 1,
      users: [],
      items: [
          { status: "Online", text: "Real-Time", icon: "mdi-clock" },
          { status: "Offline", text: "Audience", icon: "mdi-account" },
          { status: "In-Game", text: "Conversions", icon: "mdi-flag" },
      ],
  }),

  mounted(){
    const token = localStorage.getItem('token');

    if (token)
    {
      axios.get('/users', {
        headers: {
          Authorization: token,
        }
      }).then(res => {
        this.users = res.data;
      })
      .catch(error => {
        console.log(error);
      });
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
          v-for="(user) in users"
          v-if="user.username !== username && user.username !== null"
          :key="user.id"
          link
        >
          <v-list-item-icon>

           <v-avatar
              color="indigo"
              size="24"
            >
               <img
                :src="user.avatar"
                :alt="user.username"
                    >
            </v-avatar>
            <v-badge
              bottom
              v-if="user.status === 'Online'"
              color="success"
              dot
            ></v-badge>
            <v-badge
              bottom
              v-else-if="user.status === 'In-Game'"
              color="red"
              dot
            ></v-badge>
            <v-badge
              bottom
              v-else
              color="grey"
              dot
            ></v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="user.username"></v-list-item-title>
          </v-list-item-content>
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
        <UserMenu :user="user" />
        </v-list-item>
    </v-list>
    </v-navigation-drawer>
</template>