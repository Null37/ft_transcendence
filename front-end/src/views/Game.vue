<script lang="ts">
import Vue from 'vue';
import TopBar from '../components/TopBar.vue';
import UserAvatar from '../components/UserAvatar.vue';
import FriendList from '../components/FriendList.vue';
import FriendsStatus from '../components/FriendsStatus.vue';
import EditProfile from '@/components/EditProfile.vue';
import axios from 'axios';  

export default Vue.extend({
    name: "App",
    methods: {
      setUsernameMethod: function()
      {
        if (this.usernameEdit.length >= 5 && this.usernameEdit.length <= 10)
        {
          const token = localStorage.getItem('token');


          if (token)
          {
            axios.patch('/update', {
              username: this.usernameEdit 
            }, {
              headers: {
                Authorization: token
              }
            }).then(res => {
              this.username = this.usernameEdit;
              this.setUsername = false;
            })
            .catch(error => {
              console.log(error);
            });
          }
        }
      }
    },
    data: () => ({
      usernameEdit: "",
      setUsername: false,
      avatar: "",
      intra_login: "",
      status: "",
      username: "",
      drawer: null
    }),
	mounted () {
    const token = localStorage.getItem('token');
    
    if (token)
    {
      axios.get('/user/me', {
        headers: {
          Authorization: token
      }}).then(res => {
        this.avatar = res.data.avatar;
        this.username = res.data.username;
        this.intra_login = res.data.intra_login;
        this.status = res.data.status;
        if (this.username === null)
          this.setUsername = true;
      })
      .catch(error => {
        console.log(error);
      });
    }
	},
  components: { TopBar, UserAvatar, FriendList, FriendsStatus, EditProfile }
});
</script>


<template>
   <v-app id="inspire">

    <v-navigation-drawer
      v-model="drawer"
      app
      width="300"
    >
      <v-navigation-drawer
        v-model="drawer"
        absolute

        mini-variant
      >
        <v-hover
        v-slot="{ hover }"
        >
          <EditProfile :avatar="avatar" />
        </v-hover>
      </v-navigation-drawer>

      <v-sheet
        height="164"
        width="100%"
      >
      
        <v-list
          class="pl-14"
          shaped
        >
            <router-link style="text-decoration: none;" to="/Game">
                <v-list-item
                    link
                >
                    <v-list-item-content>
                    <v-list-item-title>Play a Game</v-list-item-title>
                    </v-list-item-content>
                    
                </v-list-item>
            </router-link>
            <router-link style="text-decoration: none;" to="/Community">
                <v-list-item
                    link
                >
                    <v-list-item-content>
                    <v-list-item-title>Community</v-list-item-title>
                    </v-list-item-content>
                    
                </v-list-item>
            </router-link>
            <router-link style="text-decoration: none;" to="/Logout">
                <v-list-item
                    link
                >
                    <v-list-item-content>
                    <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item-content>
                    
                </v-list-item>
            </router-link>
        </v-list>
      
      </v-sheet>

    </v-navigation-drawer>

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
          >
            <div class="text-center">
                <v-btn
                color="white"
                class="black--text"
                x-large
                >
                  Search for Game
                  </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>

    </v-main>
    <v-row justify="center">
    <v-dialog
      v-model="setUsername"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5">Set your username</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              >
                <v-text-field
                  label="Username*"
                  v-model="usernameEdit"
                  required
                ></v-text-field>
              </v-col>
             
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="setUsernameMethod"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  </v-app>
</template>

<style lang="scss" scoped>
.v-avatar.on-hover
{
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.avatar-padding
{
  padding: 0 !important;
}
.settings
{
  display: none;
  background-color: rgba(0, 0, 0, 0.2);
}

.v-avatar.on-hover > .settings
{
  display: inline-flex;
}
</style>

