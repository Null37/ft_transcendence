<script lang="ts">
import Vue from 'vue';
import TopBar from '../components/TopBar.vue';
import UserAvatar from '../components/UserAvatar.vue';
import FriendList from '../components/FriendList.vue';
import ChannelList from '../components/FriendsStatus.vue';

export default Vue.extend({
    name: "App",
    mounted() {
      var el = document.getElementById("scrooll");
      if (el != null)
      {
        el.scrollIntoView({
          block: "end",
          behavior: "auto"
        });
      }
    },
    data: () => ({
        drawer: null,
        messages: [
          {
            id: 0,
            from: 'John Josh',
            message: `Sure, I'll see yasdfou later.`,
            time: '10:42am',
            color: 'deep-purple lighten-1',
          },
          {
            id: 1,
            from: 'John Doe',
            message: 'Yeah, sure. Doesasdf 1:00pm work?',
            time: '10:37am',
            color: 'green',
          },
          {
            id: 2,
            from: 'John Josh',
            message: `Sure, I'll seesadf you later.`,
            time: '10:42am',
            color: 'deep-purple lighten-1',
          },
          {
            id: 3,
            from: 'John Doe',
            message: 'Yeah, sure. Does 1:00pm work?',
            time: '10:37am',
            color: 'green',
          },
          {
            id: 4,
            from: 'John Josh',
            message: `Sure, I'll see you later.`,
            time: '10:42am',
            color: 'deep-purple lighten-1',
          },
          {
            id: 5,
            from: 'John Doe',
            message: 'Yeah, sure. Does 1:00pm work?',
            time: '10:37am',
            color: 'green',
          },
          {
            id: 6,
            from: 'John Josh',
            message: `Sure, I'll see you later.`,
            time: '10:42am',
            color: 'deep-purple lighten-1',
          },
          {
            id: 7,
            from: 'John Doe',
            message: 'Yeah, sure. Does 1:00pm work?',
            time: '10:37am',
            color: 'green',
          },
          {
            id: 8,
            from: 'John Josh',
            message: `Sure, I'll see you later.`,
            time: '10:42am',
            color: 'deep-purple lighten-1',
          },
          {
            id: 9,
            from: 'John Doe',
            message: 'Yeah, sure. Does 1:00pm work?',
            time: '10:37am',
            color: 'green',
          },
          {
            id: 10,
            from: 'John Josh',
            message: `Sure, I'll see you later.`,
            time: '10:42am',
            color: 'deep-purple lighten-1',
          },
          {
            id: 11,
            from: 'John Doe',
            message: 'Yeah, sure. Does 1:00pm work?',
            time: '10:37am',
            color: 'green',
          },
          {
            id: 12,
            from: 'John Josh',
            message: `Sure, I'll see you later.`,
            time: '10:42am',
            color: 'deep-purple lighten-1',
          },
          {
            id: 13,
            from: 'John Doe',
            message: 'Yeah, sure. Does 1:00pm work?',
            time: '10:37am',
            color: 'green',
          },
          {
            id: 14,
            from: 'John Josh',
            message: 'Did you still want to grab lunch today?Did you still want to grab lunch today?Did you still want to grab lunch today?Did you still want to grab lunch today?Did you still want to grab lunch today?Did you still want to grab lunch today?Did you still want to grab lunch today?Did you still want to grab lunch today?Did you still want to grab lunch today?Did you still want to grab lunch today?',
            time: '9:47am',
            color: 'deep-purple lighten-1',
          },
        ],
    }),
    components: { TopBar, UserAvatar, FriendList, ChannelList }
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
      <UserAvatar />

      <v-sheet
        height="128"
        width="100%"
      >
      
        <v-list
          class="pl-14"
          shaped
        >
          <v-list-item
            link
          >
            <v-list-item-content>
              <v-list-item-title>Play a Game</v-list-item-title>
            </v-list-item-content>
            
          </v-list-item>
          <v-list-item
            link
          >
            <v-list-item-content>
              <v-list-item-title>Community</v-list-item-title>
            </v-list-item-content>
            
          </v-list-item>
        </v-list>
      
      </v-sheet>
      <FriendList />
    </v-navigation-drawer>

    <ChannelList />
    <v-main>

      <v-container fluid style="height:100%;">
        <v-row class="space-around flex-column">
          <v-card v-for="message in messages" :key="message.id" flat>              
                  <v-list-item
                      :key="message.id"
                      class=""
                    >
                      <v-list-item-avatar class="align-self-start mr-2">                     
                        <v-avatar size="40">
                          <v-img src="https://i.pinimg.com/736x/35/d5/0e/35d50ea7dac12997c537c9c7e59e5498.jpg"></v-img>
                        </v-avatar>                     
                      </v-list-item-avatar>
                      <v-list-item-content class="received-message">
                        <v-card color="grey darken-3" class="flex-none">                        
                          <v-card-text class="white--text pa-2 d-flex flex-column">
                            <span   class="text-body-2 font-weight-bold">{{message.from}} <span class="text-caption">{{message.time}}</span> </span>                                             
                            <span id="scrooll" v-if="message.id == messages.length - 1" class="align-self-start text-subtitle-1">{{ message.message }}</span>
                            <span v-else class="align-self-start text-subtitle-1">{{ message.message }}</span>
                            
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
      ></v-text-field>
    </v-footer>
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

