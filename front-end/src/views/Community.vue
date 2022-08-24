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
      console.log(data);
      this.messages.push({id: this.messages.length, from: "Akira", room: data.roomName, message: data.message});
      if (this.currentRoom == data.roomName)
        this.showmessages.push({id: this.messages.length, from: "Akira", room: data.roomName, message: data.message});
		},
    msgToRoom(data) {
      //this.messages.push({id: this.messages.length, from: "Akira", message: data.message, time: "10:43pm", color: 'deep-purple lighten-1'}); // id should be dynamic
		}



	},
    data: () => ({
      setUsername: false,
      Title: "Add new friends or join rooms to start chatting",
      me: [],
      blocked: [],
      currentRoom: "",
      receiverID: Number,
      rooms: [
      ],
      avatar: "",
      intra_login: "",
      status: "",
      username: "",
      drawer: null,
      placeHolder: "",
      tmp: [],
      showmessages: [{
        blockedUsers: null,
        message: "Use /help command to see available options",
        roomName: "",
        sender: null,
        state: "DM",
      }],
      messages: [
        {id: 0, from: "Akira", room: "bla", message: "bla", time: "10:43pm", color: 'deep-purple lighten-1'}
      ],
      users: [],
      friendlist: [],

    }),
    methods: {
      changeAvatar: function(newavatar)
      {
        this.avatar = newavatar;
      },
      blockuser: function(user)
      {
        this.blocked.push(user);
        this.users = this.users.filter(data => data.username !== user.username);
        this.friendlist = this.friendlist.filter(data => data.username !== user.username);
      },
      unblockuser: function(user)
      {
        this.users.push(user);
        this.blocked = this.blocked.filter(data => data.username !== user.username);
      },
      addroom: function(room)
      {
        console.log("room Add");
        // this.rooms.push(room);
      },
      removefriend: function(username: string)
      {
        

        for(let i = 0; i < this.friendlist.length; ++i)
        {
          if (this.friendlist[i].username === username)
          {
            console.log("found  ");
            const token = localStorage.getItem('token');

            if (token)
            {
              console.log("id ==> ", this.friendlist[i].id);
              axios.get('/friend/remove/' + this.friendlist[i].id, {
              headers: {
                Authorization: token
              }}).then(res => {
                console.log("removed");
                // this.$emit("Addroom", res.data);
                if (this.me[0].id < this.friendlist[i].id)
                  this.$socket.emit('leaveRoom', this.me[0].id+"-"+this.friendlist[i].id);
                else
                  this.$socket.emit('leaveRoom', this.friendlist[i].id+"-"+this.me[0].id);

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
          }}).then((function (res) {

            var tmp = this.users.find(data => data.username === username);
            this.friendlist.push(this.users.find(data => data.username === username));
            this.users = this.users.filter(data => data.username !== username);

            if (this.me[0].id < tmp.id)
            {
              this.$socket.emit('joinDM', this.me[0].id+"-"+tmp.id);
            }
            else
            {
              this.$socket.emit('joinDM', tmp.id+"-"+this.me[0].id);
            }

          }).bind(this))
          .catch(error => {
            console.log(error);
          }); 
        }
      },
      submitMessage: function(e: any) {
        if (e.target.value === '/help')
        {
          this.showmessages.push({
            blockedUsers: null,
            message: "Use /ban [duration] [username] to ban a user for a limited time",
            roomName: "",
            sender: null,
            state: "DM",
          });
          this.showmessages.push({
            blockedUsers: null,
            message: "Use /mute [duration] [username] to mute a user for a limited time",
            roomName: "",
            sender: null,
            state: "DM",
          });
          this.showmessages.push({
            blockedUsers: null,
            message: "Use /changepassword [password] to change/set room password(room will be protected)",
            roomName: "",
            sender: null,
            state: "DM",
          });
          this.showmessages.push({
            blockedUsers: null,
            message: "Use /admin [username] to set a user as administrator",
            roomName: "",
            sender: null,
            state: "DM",
          });
          this.placeHolder = "";
        }
        else if (e.target.value !== '' && this.currentRoom != '')
        {
          this.showmessages.push({id: this.messages.length, from: "Akira", message: e.target.value, time: "10:43pm", color: 'deep-purple lighten-1'}); // id should be dynamic
          console.log("me id = "+this.me[0].id);
          console.log("me receiverID = "+this.receiverID);
          this.$socket.emit('msgToClientDM', {text: this.placeHolder, room: this.currentRoom, sender: this.me[0].id, receiver: this.receiverID})
          this.placeHolder = "";
        }
      },
      ShowChatMessages: function(friend: string){
        if (this.currentRoom != friend.id+"-"+this.me[0].id && this.currentRoom != this.me[0].id+"-"+friend.id)
        {
          this.Title = friend.username;
          if (friend.id < this.me[0].id)
            this.currentRoom = friend.id+"-"+this.me[0].id;
          else
            this.currentRoom = this.me[0].id+"-"+friend.id;
          this.receiverID = friend.id;
          var r = this.currentRoom;
          this.showmessages = this.messages.filter(el => {
            return el.room === r;
          });
        }
        
        // SocketInstance.join()
        
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
        
        console.log("users == >");
        console.log(this.users);
        this.users = this.users.filter((el) => {
            return this.me.some((f) => {
              return f.username !== el.username;
            });
          });
        
        axios.get('/friend/find', {
          headers: {
            Authorization: token
        }}).then((function (res) {
          this.friendlist = res.data;

          console.log("friendlist==>");
          console.log(this.friendlist);
          if (this.friendlist.length > 0)
          {

            
            this.users = this.users.filter((function ( el )
            {
              let ret = true;
              this.friendlist.forEach(element => {
                if (element.username == el.username)
                {
                  ret = false;
                }
              });
              return ret;
            }).bind(this));



          }
          axios.get('/block/find', {
            headers: {
              Authorization: token
          }}).then((function (res) {
            this.blocked = res.data;
            
            this.users = this.users.filter((function ( el )
            {
              let ret = true;
              this.blocked.forEach(element => {
                if (element.username == el.username)
                {
                  ret = false;
                }
              });
              return ret;
            }).bind(this));

          }).bind(this))
          .catch(error => {
            console.log(error);
          });

          for (let i = 0; i < this.rooms.length; ++i)
            this.$socket.emit('joinDM', this.rooms.roomName);
          for (let i = 0; i < this.friendlist.length; i++)
          {
            if (this.me[0].id < this.friendlist[i].id)
            {
              console.log(this.me[0].id+"-"+this.friendlist[i].id);
              this.$socket.emit('joinDM', this.me[0].id+"-"+this.friendlist[i].id);
            }
            else
            {
              this.$socket.emit('joinDM', this.friendlist[i].id+"-"+this.me[0].id);
              console.log(this.friendlist[i].id+"-"+this.me[0].id);
            }
          }

        }).bind(this))
        .catch(error => {
          console.log(error);
        });
        
      })
      .catch(error => {
        console.log(error);
      });

      axios.get('/rooms/findUserRooms', {
        headers: {
          Authorization: token
      }}).then((function (res) {
        this.rooms = res.data;
        console.log("data ===> ");
        console.log(res.data);
      }).bind(this))
      .catch(error => {
        console.log(error);
      });

      
    }
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
      <UserAvatar @changeAvatar="changeAvatar" @Addroom="addroom" :rooms="rooms" :avatar="avatar" />

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

    <FriendsStatus @blockuser="blockuser" @unblockuser="unblockuser" :blocked="blocked" @Addfriend="Addfriend" @removefriend="removefriend" :users="users" :friends="friendlist" :username="me.username" />
    <v-main>

      <v-container fluid style="height:100%;">
        <v-row class="space-around flex-column">
          <v-card v-for="message in showmessages" :key="message.id" flat>              
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

