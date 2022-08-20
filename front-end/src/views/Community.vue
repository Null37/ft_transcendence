<script lang="ts">
import Vue from 'vue';
import TopBar from '../components/TopBar.vue';
import UserAvatar from '../components/UserAvatar.vue';
import FriendList from '../components/FriendList.vue';
import FriendsStatus from '../components/FriendsStatus.vue';
import Profile from '@/components/Profile.vue';
import axios from 'axios';
import io from 'socket.io-client';
import { SocketInstance } from '@/main';

// SocketInstance.on('msgToClient')
// SocketInstance.on('msgToClient', (msg: any) => {
// 	console.log(`received a message: ${msg}`)
// 	// this.messages.push({id: 0, from: "", message: msg, time: "", color: 'deep-purple lighten-1'}); // id should be dynamic
// })
export default Vue.extend({
    name: "App",
	sockets: {
		msgToClient(data) {
			console.log("reached the event")
          this.messages.push({id: this.messages.length, from: "Akira", message: data.message, time: "10:43pm", color: 'deep-purple lighten-1'}); // id should be dynamic
		}



	},
    data: () => ({
      setUsername: false,
      Title: "Add new friends to chat with",
      me: [],
      avatar: "",
      intra_login: "",
      status: "",
      username: "",
      drawer: null,
      placeHolder: "",
      tmp: [],
      messages: [
        {
          id: 0,
          from: 'John Josh',
          message: `Sure, I'll see yasdfou later.`,
          time: '10:42am',
          color: 'deep-purple lighten-1',
        },
      ],
      users: [],
      friendlist: [],

    }),
    methods: {
      removefriend: function(username: string)
      {
        

        for(let i = 0; i < this.users.length; ++i)
        {
          if (this.users[i].username === username)
          {
            const token = localStorage.getItem('token');

            if (token)
            {
              console.log("id ==> ", this.users[i].id);
              axios.get('/friend/remove/' + this.users[i].id, {
              headers: {
                Authorization: token
              }}).then(res => {

                this.users.push(this.friendlist.find(data => data.username === username));
                this.friendlist = this.friendlist.filter(data => data.username !== username);

              })
              .catch(error => {
                console.log(error);
              });
            }
          }
        }

      },
      Addfriend: function(username: string)
      {
        const token = localStorage.getItem('token');

        if (token)
        {
          axios.get('/friend/add/'+this.users.find(data => data.username === username).id, {
          headers: {
            Authorization: token
          }}).then(res => {

            this.friendlist.push(this.users.find(data => data.username === username));
            this.users = this.users.filter(data => data.username !== username);

          })
          .catch(error => {
            console.log(error);
          }); 
        }
      },
      submitMessage: function(e: any) {
        if (e.target.value !== '')
        {
          this.messages.push({id: this.messages.length, from: "Akira", message: e.target.value, time: "10:43pm", color: 'deep-purple lighten-1'}); // id should be dynamic
          console.log("id ===> ", this.me[0].id)
          this.$socket.emit('msgToClientDM', {text: this.placeHolder, room: 'id1-id2', userID: this.me[0].id})
          this.placeHolder = "";
        }
      },
      ShowChatMessages: function(username: string){
        this.Title = username;
        this.messages = [];
        // SocketInstance.join()
        this.$socket.emit('joinDM', "id1-id2");
      },
      updateMessage: function(e: any){
        this.placeHolder = e.target.value;
      },
      setUsernameMethod: function()
      {
        if (this.me.username.length > 5 && this.me.username.length < 10)
        {
          const token = localStorage.getItem('token');

          if (token)
          {
            axios.patch('/update', {
              userame: this.me.username 
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
    
	mounted () {
    const token = localStorage.getItem('token');
    
    if (token)
    {
      axios.get('/user/me', {
        headers: {
          Authorization: token
      }}).then(async (res) => {
        await this.me.push(res.data);
        this.avatar = this.me[0].avatar;
        if (this.me.username === null)
          this.setUsername = true;
      })
      .catch(error => {
        console.log(error);
      });


      axios.get('/users', {
        headers: {
          Authorization: token
      }}).then(res => {
        this.users = res.data;
        
        this.users = this.users.filter((el) => {
            return this.me.some((f) => {
              return f.username !== el.username;
            });
          });
        
        axios.get('/friend/find', {
          headers: {
            Authorization: token
        }}).then(res => {
          this.tmp;


          this.tmp = res.data;
          for (let i = 0; i < this.tmp.length; ++i)
          {
            this.friendlist.push(this.tmp[i].friend_id);
          }
          if (this.friendlist.length > 0)
          {
            this.users = this.users.filter((el) => {
              return this.friendlist.some((f) => {
                return f.username !== el.username;
              });
            });
          }
  

        })
        .catch(error => {
          console.log(error);
        });
        
      })
      .catch(error => {
        console.log(error);
      });

    }
  },
setup() {
	// let  socket = io("http://127.0.0.1:3000");

	// // socket.emit('joinDM', {roomName: 'foo'});
	// socket.on('msgToClient',  (res) => {
	// console.log("received == > ");
	// console.log(res);
	// })
},
  components: { TopBar, UserAvatar, FriendList, FriendsStatus, Profile }

  },
);
</script>


<template>
   <v-app id="inspire">
    <TopBar :title="Title" />

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
      <FriendList :friends="friendlist" @ShowChatMessages="ShowChatMessages"/>
    </v-navigation-drawer>

    <FriendsStatus @Addfriend="Addfriend" @removefriend="removefriend" :users="users" :friends="friendlist" :username="me.username" />
    <v-main>

      <v-container fluid style="height:100%;">
        <v-row class="space-around flex-column">
          <v-card v-for="message in messages" :key="message.id" flat>              
                  <v-list-item
                      :key="message.id"
                      class=""
                    >
                      <v-list-item-avatar class="align-self-start mr-2">
                        <Profile :avatar="avatar" :username="message.from" />                   
                                
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

