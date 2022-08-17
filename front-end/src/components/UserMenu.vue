<template>
  <v-row justify="space-around">
    <v-menu
      offset-y
    >
      <template v-slot:activator="{ attrs, on }">

          <v-list-item
            v-bind="attrs"
            v-on="on"
            link
          
        >
          <v-list-item-icon>

           <v-avatar
              color="indigo"
              size="24"
            >
               <img
                        :src="user.avatar"
                        alt="John"
                    >
            </v-avatar>
            <v-badge
              bottom
              color="grey"
              dot
            ></v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >{{user.username}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-list>
        <v-list-item
          link
        >
          <v-list-item-title @click="AddFriend()" >Add friend</v-list-item-title>
        </v-list-item>
         <v-list-item
          link
        >
          <v-list-item-title >Mute</v-list-item-title>
        </v-list-item>
         <v-list-item
          link
        >
          <v-list-item-title >Ban</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-row>
</template>

<script>
import axios from 'axios';
  export default {
    props: ['user'],
    data: () => ({
    }),
    methods: {
      AddFriend: function()
      {
        const token = localStorage.getItem('token');
    
        if (token)
        {
          axios.get('/friend/add/'+this.user.id, {
            headers: {
              Authorization: token
          }}).then(res => {
            console.log(res);
          })
          .catch(error => {
            console.log(error);
          });
        }
      }
    }
  }
</script>