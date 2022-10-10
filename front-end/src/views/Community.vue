<script lang="ts">
import Vue from 'vue';
import TopBar from '../components/TopBar.vue';
import UserAvatar from '../components/UserAvatar.vue';
import FriendList from '../components/FriendList.vue';
import FriendsStatus from '../components/FriendsStatus.vue';
import Profile from '@/components/Profile.vue';
import axios from 'axios';
import Ladder from '@/components/Ladder.vue';

export default Vue.extend({
    name: "App",
    sockets: {
      msgToClient(data) {
        this.messages.push({id: this.messages.length, from: data.sender, room: data.roomName, message: data.message});
        if (this.currentRoom == data.roomName)
          this.showmessages.push({id: this.showmessages.length, from: data.sender, room: data.roomName, message: data.message});
      },
      msgToRoom(data) {
        for(let i = 0; i < this.blocked.length; i++)
        {
          if(this.blocked[i].username === data.sender.username)
            return;
        }
        this.messages.push({id: this.messages.length, from: data.sender, room: data.roomName, message: data.message});
        if (this.currentRoom == data.roomName)
          this.showmessages.push({id: this.showmessages.length, from: data.sender, room: data.roomName, message: data.message});
      },
	  leaveRoom(data)
	  {
      if (this.me[0].username === data[0])
      {

        this.rooms = this.rooms.filter(r => r.roomName !== data[1]);
        this.$socket.emit('leaveRoom', data[0]);
        this.currentRoom = "";
        
      }
	  },
	  statusChanged(data)
	  {

      for (let i = 0; i < this.friendlist.length; i++)
      {
        if (this.friendlist[i].username === data.username)
        {
          this.friendlist[i].status = data.status;
          if (data.gameID)
            this.friendlist[i].match = data.gameID;
          return ;
        }
      }

      for (let i = 0; i < this.users.length; i++)
      {
        if (this.users[i].username === data.username)
        {

          if (data.gameID)
            this.users[i].match = data.gameID;
          this.users[i].status = data.status;
          return ;
        }
      }

      for (let i = 0; i < this.blocked.length; i++)
      {
        if (this.blocked[i].username === data.username)
        {
          if (data.gameID)
            this.blocked[i].match = data.gameID;
          this.blocked[i].status = data.status;
          return ;
        }
      }
    
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
      roomorfriend: false,
      status: "",
      username: "",
      drawer: null,
      placeHolder: "",
      tmp: [],
      showmessages: [],
      messages: [
      ],
      users: [],
      friendlist: [],

    }),
    methods: {
    loadImage(event) {
      const token = localStorage.getItem('token');
      const { files } = event.target;
      if (token && files && files[0]) {
        const data = new FormData();
        data.append("file", files[0]);
        
        axios.post("/upload/image", data, {
          headers: {
              Authorization: token
            }
        }).then((function (res) {
          this.error = false;
          this.avatar = res.data;
        }).bind(this)).catch((function (err) {
          this.error = true;
        }).bind(this));
      }
    },
		logout: function()
		{

			this.$socket.emit('disconnectUser', this.me[0].username);
			
		},
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
      addroom: function(roomname)
      {
        const token = localStorage.getItem('token');

        if (token)
        {
          axios.get('/rooms/userOfRoom/'+roomname, {
            headers: {
              Authorization: token
          }}).then((function (res) {
            this.rooms.push(res.data[0]);
            this.$socket.emit('joinRoom', roomname);


          }).bind(this))
          .catch(error => {

          });
        }
      },
      removefriend: function(username: string)
      {
        

        for(let i = 0; i < this.friendlist.length; ++i)
        {
          if (this.friendlist[i].username === username)
          {

            const token = localStorage.getItem('token');

            if (token)
            {

              axios.get('/friend/remove/' + this.friendlist[i].id, {
              headers: {
                Authorization: token
              }}).then(res => {

                // this.$emit("Addroom", res.data);
                if (this.me[0].id < this.friendlist[i].id)
                {

                  this.$socket.emit('leaveRoom', this.me[0].id+"-"+this.friendlist[i].id);
                }
                else
                {

                  this.$socket.emit('leaveRoom', this.friendlist[i].id+"-"+this.me[0].id);
                }

                this.users.push(this.friendlist.find(data => data.username === username));
                this.friendlist = this.friendlist.filter(data => data.username !== username);

              })
              .catch(error => {

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

          }); 
        }
      },
      submitMessage: function(e: any) {
        if ((!this.roomorfriend || this.currentRoom === '') && e.target.value === '/help')
        {
          this.showmessages.push({
            message: "Use /ban [username] [duration] to ban a user for a limited time",
            roomName: this.currentRoom,
            from: this.me[0],
          });
          this.showmessages.push({
            message: "Use /mute [username] [duration] to mute a user for a limited time",
            roomName: this.currentRoom,
            from: this.me[0],
          });
          this.showmessages.push({
            message: "Use /changepassword [password] to change/set room password(room will be protected)",
            roomName: this.currentRoom,
            from: this.me[0],
          });
          this.showmessages.push({
            message: "Use /admin [username] to set a user as administrator",
            roomName: this.currentRoom,
            from: this.me[0],
          });
		      this.showmessages.push({
            message: "Use /leave to leave this chat room",
            roomName: this.currentRoom,
            from: this.me[0],
          });
          this.placeHolder = "";
        }
        else if (!this.roomorfriend && e.target.value !== '' && e.target.value.startsWith("/"))
        {
			      var arr = this.placeHolder.split(" ");
          	if (arr[0] !== '/ban' && arr[0] !== '/mute' && arr[0] !== '/leave' && arr[0] !== '/admin' && arr[0] !== '/changepassword' && arr[0] !== '/help')
          	{

            	this.showmessages.push({
        			message: "Unknown command. Please use /help.",
              		roomName: this.currentRoom,
              		from: this.me[0],
            		});
          	}
            else if ((arr[0] === '/ban' || arr[0] === '/mute') && arr.length !== 3)
            {
              this.showmessages.push({
                    message: "Wrong number of arguments. Please use /help.",
                        roomName: this.currentRoom,
                        from: this.me[0],
                      });
            }
            else if ((arr[0] === '/admin' || arr[0] === '/changepassword') && arr.length  !== 2)
            {
              this.showmessages.push({
                    message: "Wrong number of arguments. Please use /help.",
                        roomName: this.currentRoom,
                        from: this.me[0],
                      });
            }
            else
            {
              this.$socket.emit('msgToRoom', {text: this.placeHolder, room: this.currentRoom, userID: this.me[0].id})
              this.messages.push({id: this.messages.length, from: this.me[0], room: this.currentRoom, message: this.placeHolder});

            }
          this.placeHolder = "";
        }
        else if (this.roomorfriend && e.target.value == "/invite")
        {

              const token = localStorage.getItem('token');

              if (token)
              {
                axios.get('/invite_game/'+this.me[0].id, {
                  headers: {
                    Authorization: token
                  }
                }).then((function (res) {

                  this.placeHolder = "http://"+process.env.VUE_APP_HOSTIP+":8080/play?match="+res.data.generatedMaps[0].id;
                  this.$socket.emit('msgToClientDM', {text: this.placeHolder, room: this.currentRoom, sender: this.me[0].id, receiver: this.receiverID})
                  this.placeHolder = "";
                  this.$router.push({ path: '/play?match='+res.data.generatedMaps[0].id }).catch(() => {})
                  this.$router.go(1);
                this.$router.go(1);
                }).bind(this))
                .catch(error => {

                });
              }
        }
        else if (e.target.value !== '' && this.currentRoom != '')
        {
          this.showmessages.push({id: this.showmessages.length, room: this.currentroom, from: this.me[0], message: e.target.value});
          if (this.roomorfriend == true)
          {
            this.$socket.emit('msgToClientDM', {text: this.placeHolder, room: this.currentRoom, sender: this.me[0].id, receiver: this.receiverID})
              this.messages.push({id: this.messages.length, from: this.me[0], room: this.currentRoom, message: this.placeHolder});
            }
            else
            {
              this.$socket.emit('msgToRoom', {text: this.placeHolder, room: this.currentRoom, userID: this.me[0].id})
              this.messages.push({id: this.messages.length, from: this.me[0], room: this.currentRoom, message: this.placeHolder});
          }
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
          this.roomorfriend = true;
          this.receiverID = friend.id;
          var r = this.currentRoom;
          this.showmessages = this.messages.filter(el => {
            return el.room === r;
          });
        }
        
        
      },
      showChatroom: function(roomname)
      {
        if (this.currentRoom != roomname)
        {
          this.Title = roomname;
          this.currentRoom = roomname;
          this.roomorfriend = false;

          this.showmessages = this.messages.filter(el => {
            return el.room === roomname;
          });
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
              this.me[0].username = this.username;
				      this.$socket.emit('connectUser', {username: this.me[0].username, label: "Online"});

            })
            .catch(error => {

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
		}}).then((async function(res) {
			
		this.$socket.connect();
    	await this.me.push(res.data);
        this.avatar = this.me[0].avatar;
        if (this.me[0].username === null)
			    this.setUsername = true;
        else
        {
          
          this.showmessages.push({
              id: 0,
              message: "Use /help command to see available options",
              room: "",
              from: this.me[0],
            });
          this.$socket.emit('connectUser', {username: this.me[0].username, label: "Online"});
        }
    




	}).bind(this))
	.catch(error => {

	});
	
	// this.$socket.emit('connectUser', this.me[0].username, "blabla");


      axios.get('/users', {
        headers: {
          Authorization: token
      }}).then(res => {
        this.users = res.data;
        

        axios.get('/friend/find', {
          headers: {
            Authorization: token
        }}).then((function (res) {
          this.friendlist = res.data;
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

          });

          for (let i = 0; i < this.friendlist.length; i++)
          {
            if (this.me[0].id < this.friendlist[i].id)
            {

              this.$socket.emit('joinDM', this.me[0].id+"-"+this.friendlist[i].id);
            }
            else
            {
              this.$socket.emit('joinDM', this.friendlist[i].id+"-"+this.me[0].id);

            }
          }

        }).bind(this))
        .catch(error => {

        });
        
      })
      .catch(error => {

      });

      axios.get('/rooms/findUserRooms', {
        headers: {
          Authorization: token
      }}).then((function (res) {
        this.rooms = res.data;

        for(let i = 0; i < this.rooms.length; i++)
        {
          this.$socket.emit('joinRoom', this.rooms[i].roomName);
        }

      }).bind(this))
      .catch(error => {

      });

      
    }

  },
  components: { TopBar, UserAvatar, FriendList, FriendsStatus, Profile, Ladder }

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
      <UserAvatar :userme="username" @showChatroom="showChatroom" @changeAvatar="changeAvatar" @Addroom="addroom" :rooms="rooms" :avatar="avatar" />

      <v-sheet
        height="205"
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
            <Ladder />
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
                        <Profile :avatar="message.from.avatar" :id="message.from.id" :username="message.from.username" />                   
                                
                      </v-list-item-avatar>
                      <v-list-item-content class="received-message">
                        <v-card color="grey darken-3" class="flex-none">                        
                          <v-card-text class="white--text pa-2 d-flex flex-column">
                            <span   class="text-body-2 font-weight-bold">{{message.from.username}} </span>                                             
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
              <v-col align="center"
                justify="center">
                 <v-avatar size="102">
                    <img
                        :src="avatar"
                        alt="John"
                    >
                </v-avatar>
              </v-col>
              
            </v-row>

            <v-row>
              <v-col>
                <input ref="file" type="file" accept="image/*" @submit.prevent @change="loadImage($event)" />
              </v-col>
            </v-row>
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
            @keyup.enter="setUsernameMethod"
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

