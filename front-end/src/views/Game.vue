<script lang="ts">
import Vue from 'vue';
import TopBar from '../components/TopBar.vue';
import UserAvatar from '../components/UserAvatar.vue';
import FriendList from '../components/FriendList.vue';
import FriendsStatus from '../components/FriendsStatus.vue';
import EditProfile from '@/components/EditProfile.vue';
import axios from 'axios';
import io from 'socket.io-client';
import { FingerprintSpinner } from 'epic-spinners';
import { AtomSpinner } from 'epic-spinners';
import { SelfBuildingSquareSpinner  } from 'epic-spinners';
import { OrbitSpinner } from 'epic-spinners';
import { SemipolarSpinner  } from 'epic-spinners';
import { FulfillingSquareSpinner } from 'epic-spinners';
import { SpringSpinner } from 'epic-spinners';
import { HalfCircleSpinner } from 'epic-spinners';

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast, { position: 'top-right' });

export default Vue.extend({
    name: "App",

    methods: {
    changeAvatarC: function(newavatar: any)
    {
      this.avatar = newavatar;
    },
		logout: function()
		{

			this.$socket.emit('disconnectUser', this.username);
			
		},
		setUsernameMethod: function() {
        if (this.usernameEdit.length >= 5 && this.usernameEdit.length <= 10)
        {
          const token = localStorage.getItem('token');

          if (token)
          {
            axios.patch('/update',
              { username: this.usernameEdit },
              { headers: { Authorization: token }
            })
            .then((function (res)  {
              this.username = this.usernameEdit;
              this.setUsername = false;
              this.isUsernameError = false;
              this.usernameError = "";

			  this.$socket.emit('connectUser', {username: this.usernameEdit, label: "Online"});
            }).bind(this))
            .catch(error => {

              this.isUsernameError = true;
              this.usernameError = "Username is not unique!";
            });
          }
        }
        else
        {
          this.isUsernameError = true;
          this.usernameError = "The username must be between 5 and 10 chars!";
        }
      },
      emitJoin() {

        
        this.gameSocket.emit('joinQueue');
        this.isSpeedyLoading = false;
        this.isLoading = true;
      },
      emitCancel() {


        this.gameSocket.emit('cancelQueue');
        this.isLoading = false;
      },

      // speedy game
      emitSpeedyJoin() {

        
        this.gameSocket.emit('joinSpeedyQueue');
        this.isLoading = false;
        this.isSpeedyLoading = true;
      },
      emitSpeedyCancel() {


        this.gameSocket.emit('cancelSpeedyQueue');
        this.isSpeedyLoading = false;
      },
	  statusChanged(data: any)
	  {


      for (let i = 0; i < this.friendlist.length; i++)
      {
        if (this.friendlist[i].username === data.username)
        {
          this.friendlist[i].status = data.status;
          return ;
        }
      }

      for (let i = 0; i < this.users.length; i++)
      {
        if (this.users[i].username === data.username)
        {
          this.users[i].status = data.status;
          return ;
        }
      }

      for (let i = 0; i < this.blocked.length; i++)
      {
        if (this.blocked[i].username === data.username)
        {
          this.blocked[i].status = data.status;
          return ;
        }
      }
    
	  }
    },

    data: () => ({
      usernameEdit: "" as string,
      setUsername: false as Boolean,
      avatar: "" as string,
      intra_login: "" as string,
      status: "" as string,
      username: "" as string,
      drawer: null,
      gameSocket: null as any,
      isLoading: false as Boolean,
      isSpeedyLoading: false as Boolean,
      socketURL: "" as string,
      isUsernameError: false as Boolean,
      usernameError: "" as string,
    }),

    created () {
      this.socketURL = location.protocol + "//" + location.hostname + ":" + 3000 + "/game";

      this.gameSocket = io(this.socketURL, {
        transportOptions: {
          polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
        },
      });

      this.gameSocket.on('queueResponse', (data: any) => {

        // redirection
        if (typeof data.identifiers === 'object' && typeof data.identifiers[0]?.id === 'string')
          // send id to ping pong view
          this.$router.push({ name: 'Play', query: { match: "" + data.identifiers[0].id, } }).catch(() => {})


        this.isLoading = false;
      });

      this.gameSocket.on('queueSpeedyResponse', (data: any) => {

        // redirection
        if (typeof data.identifiers === 'object' && typeof data.identifiers[0]?.id === 'string')
          // send id to ping pong view
          this.$router.push({ name: 'Speedy', query: { match: "" + data.identifiers[0].id, } }).catch(() => {}).catch(() => {})


        this.isLoading = false;
      });
    },

    mounted () {
      const token = localStorage.getItem('token');

      if (token)
      {
        axios.get('/user/me', {
          headers: {
            Authorization: token
        }}).then(res => {
			this.$socket.connect();
        	this.avatar = res.data.avatar;
        	this.username = res.data.username;
        	this.intra_login = res.data.intra_login;
        	this.status = res.data.status;
        	if (this.username === null)
            	this.setUsername = true;
			else
			{
				this.$socket.emit('connectUser',  {username: this.username, label: "Online"});
			}
        })
        .catch(error => {
        });
      }
      
      if (this.$route.params.error !== undefined) {

        Vue.$toast.error(this.$route.params.error);
      }
    },
    components: { TopBar, UserAvatar, FriendList, FriendsStatus, EditProfile, FingerprintSpinner, AtomSpinner, SelfBuildingSquareSpinner, OrbitSpinner, SemipolarSpinner, FulfillingSquareSpinner, SpringSpinner, HalfCircleSpinner }
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
          <EditProfile @changeAvatar="changeAvatarC" :avatar="avatar" />
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
					@click="logout()"
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
              <v-btn v-if="!isLoading"
              color="white" class="black--text btn-m"
              x-large
              v-on:click="emitJoin()"
              >
                  Normal Game
              </v-btn>
              <v-btn v-if="isLoading"
              color="white" class="black--text btn-m"
              x-large
              v-on:click="emitCancel()"
              >
                <semipolar-spinner
                  :animation-duration=1000
                  :size="50"
                  color="#444"
                />
              </v-btn>
            </div>

            <div class="text-center">
              <v-btn v-if="!isSpeedyLoading"
              color="yellow" class="black--text btn-m"
              x-large
              v-on:click="emitSpeedyJoin()"
              >
                  Speedy Game
              </v-btn>
              <v-btn v-if="isSpeedyLoading"
              color="yellow" class="black--text btn-m"
              x-large
              v-on:click="emitSpeedyCancel()"
              >
                <semipolar-spinner
                  :animation-duration=1000
                  :size="50"
                  color="#444"
                />
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
        <v-card-text v-if="isUsernameError" class="justify-center">
          <span class="red--text">{{ usernameError }}</span>
        </v-card-text>
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

.v-toast {
    font-family: Helvetica, sans-serif;
}

.btn-m {
  margin-bottom: 15px;
}
</style>