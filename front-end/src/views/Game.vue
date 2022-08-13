<script lang="ts">
import Vue from 'vue';
import TopBar from '../components/TopBar.vue';
import UserAvatar from '../components/UserAvatar.vue';
import FriendList from '../components/FriendList.vue';
import FriendsStatus from '../components/FriendsStatus.vue';

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
      }
    },
    data: () => ({
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
		// this.$socket.
		this.sockets.subscribe("msgToClient", (msg: any) => {
			this.messages.push({id: 0, from: "", message: msg, time: "", color: 'deep-purple lighten-1'}); // id should be dynamic
		})
	},
    components: { TopBar, UserAvatar, FriendList, FriendsStatus }
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
          <v-avatar
            class="d-block text-center mx-auto mt-4"
            color="primary"
            size="36"
            :class="{ 'on-hover': hover }"
          >
            <v-btn
              class="settings avatar-padding"
              min-width="36px"
              :elevation="1"
            >
              <v-icon
              dark
              >mdi-cog</v-icon>
            </v-btn>

            <img
              :elevation="2"
              alt="Avatar"
              src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
            >
          </v-avatar>
        </v-hover>
      </v-navigation-drawer>

      <v-sheet
        height="128"
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
        </v-list>
      
      </v-sheet>

    </v-navigation-drawer>

    <FriendsStatus />
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

