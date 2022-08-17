<script lang="ts">
import Vue from 'vue';
import TopBar from '../components/TopBar.vue';
import UserAvatar from '../components/UserAvatar.vue';
import FriendList from '../components/FriendList.vue';
import FriendsStatus from '../components/FriendsStatus.vue';
import Profile from '@/components/Profile.vue';
import axios from 'axios';

// SocketInstance.on('msgToClient')
// SocketInstance.on('msgToClient', (msg: any) => {
// 	console.log(`received a message: ${msg}`)
// 	// this.messages.push({id: 0, from: "", message: msg, time: "", color: 'deep-purple lighten-1'}); // id should be dynamic
// })
export default Vue.extend({
    name: "App",
    methods: {
      submitMessage: function(e: any) {
        if (e.target.value !== '')
        {
          this.messages.push({id: this.messages.length, from: "Akira", message: e.target.value, time: "10:43pm", color: 'deep-purple lighten-1'}); // id should be dynamic
          this.$socket.emit('msgToServer', this.placeHolder)
          this.placeHolder = "";
        }
      },

      updateMessage: function(e: any){
        this.placeHolder = e.target.value;
      },
      setUsernameMethod: function()
      {
        if (this.username.length > 5 && this.username.length < 10)
        {
          const token = localStorage.getItem('token');

          console.log(this.username);
          if (token)
          {
            axios.patch('/update', {
              userame: this.username 
            }, {
              headers: {
                Authorization: token
              }
            }).then(res => {
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
      setUsername: false,
      avatar: "",
      intra_login: "",
      status: "",
      username: "",
      drawer: null,
      placeHolder: "",
      messages: [
        {
          id: 0,
          from: 'John Josh',
          message: `Sure, I'll see yasdfou later.`,
          time: '10:42am',
          color: 'deep-purple lighten-1',
        },
      ],
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
		// this.$socket.
		this.sockets.subscribe("msgToClient", (msg: any) => {
      this.messages.push({id: 0, from: "", message: msg, time: "", color: 'deep-purple lighten-1'}); // id should be dynamic
    })
  },
  components: { TopBar, UserAvatar, FriendList, FriendsStatus, Profile }
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
      <UserAvatar :avatar="avatar" />

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
      <FriendList />
    </v-navigation-drawer>

    <FriendsStatus :username="username" />
    <v-main>

      <v-container fluid style="height:100%;">
        <v-row class="space-around flex-column">
          <v-card v-for="message in messages" :key="message.id" flat>              
                  <v-list-item
                      :key="message.id"
                      class=""
                    >
                      <v-list-item-avatar class="align-self-start mr-2">
                        <Profile :avatar="avatar" />                   
                                
                      </v-list-item-avatar>
                      <v-list-item-content class="received-message">
                        <v-card color="grey darken-3" class="flex-none">                        
                          <v-card-text class="white--text pa-2 d-flex flex-column">
                            <span   class="text-body-2 font-weight-bold">{{message.from}} <span class="text-caption">{{message.time}}</span> </span>                                             
                            <span class="align-self-start text-subtitle-1">{{ message.message }}</span>
                            
                          </v-card-text>
                        </v-card>                   
                      </v-list-item-content>
                  </v-list-item>
                </v-card>
        </v-row>
      </v-container>

    </v-main>
    <v-footer
      app
      height="72"
      inset
    >
      <v-text-field
        dense
        flat
        hide-details
        rounded
        solo
		v-model="placeHolder"
		@keyup.enter="submitMessage"
      ></v-text-field>
    </v-footer>


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
                  v-model="username"
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
.chat-message {
  display: unset !important;
  white-space: break-spaces;
}
.chat-screen {
  max-height: 320px;
  overflow-y: auto;
}
.flex-none {
  flex: unset;
}
.sent-message::after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: auto;    
    right: 54px;
    top: 12px;
    bottom: auto;
    border: 12px solid;
    border-color: #1976d2 transparent transparent transparent;
}
</style>

