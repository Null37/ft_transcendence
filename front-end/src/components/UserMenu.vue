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
              v-if="user.status === 'Online'"
              color="green"
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
              color="grey"
              v-else
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
          v-if="status === 'friend'" @click="$emit('removefriend', user.username)"
        >
          <v-list-item-title  >Remove friend</v-list-item-title>
        </v-list-item>
        <v-list-item
          link
          v-else-if="status === 'user'" @click="$emit('Addfriend', user.username)"
        >
          <v-list-item-title >Add friend</v-list-item-title>
        </v-list-item>
         <v-list-item
          link
          v-if="status === 'blocked'"
          @click="unblockuser(user)"
        >
          <v-list-item-title >Unblock</v-list-item-title>
        </v-list-item>
       
        <v-list-item
          link
          v-else-if="status === 'friend' || status === 'user'"
          @click="blockuser(user)"
        >
          <v-list-item-title >block</v-list-item-title>
        </v-list-item>
        <v-list-item
          link
          v-if="user.status === 'In-Game'"
          @click="redirectToGame()"
        >
          <v-list-item-title >Spectate Game</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-row>
</template>

<script>
import axios from 'axios';
  export default {
    props: ['user', 'status'],
    data: () => ({
    }),
    methods: {
      redirectToGame: function ()
      {
      },
      unblockuser: function (user)
      {
        const token = localStorage.getItem('token');
    
        if (token)
        {

          axios.get('/block/unblock/'+user.id, {
            headers: {
              Authorization: token
          }}).then((function (res) {
            this.$emit("unblockuser", res.data);
          }).bind(this))
          .catch(error => {
            console.log(error);
          });

        }
      },
      blockuser: function (user)
      {
        const token = localStorage.getItem('token');
    
        if (token)
        {

          axios.get('/block/'+user.id, {
            headers: {
              Authorization: token
          }}).then((function (res) {
            this.$emit("blockuser", user);
          }).bind(this))
          .catch(error => {
            console.log(error);
          });

        }
      }
    }
  }
</script>