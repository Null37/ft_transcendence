<script lang="ts">
import axios from 'axios';

  export default {
    props: ['avatar'],
    data: () => ({
      dialog: false,
      error: false,
      roompassword: "",
      rooms: [
        ]
    }),
    methods: {
      trypassword: function(roomName)
      {
        const token = localStorage.getItem('token');
    
        if (token)
        {
          const data = {
            password: this.roompassword,
          };
          axios.post('/rooms/joinRoom/'+roomName, data, {
            headers: {
              Authorization: token
          }}).then((function(res) {
            this.rooms = this.rooms.filter(data => data.roomName !== roomName);
            this.$emit("Addroom", roomName);
            this.error = false;
            this.roompassword = '';
          }).bind(this))
          .catch(error => {
            this.error = true;
			console.log(error);
          });
        }
      },
      joinRoom: function (roomName)
      {
        const token = localStorage.getItem('token');
    
        if (token)
        {
          axios.post('/rooms/joinRoom/'+roomName, {}, {
            headers: {
              Authorization: token
          }}).then((function (res) {
            this.rooms = this.rooms.filter(data => data.roomName !== roomName);
            this.$emit("Addroom", roomName);
            this.error = false;
          }).bind(this))
          .catch(error => {
            this.error = true;
          });
          
        }
      }
    },
    mounted (){
      const token = localStorage.getItem('token');
    
      if (token)
      {
        axios.get('/rooms/roomsList', {
          headers: {
            Authorization: token
        }}).then((function(res) {
          this.rooms = res.data;
          axios.get('/rooms/findUserRooms', {
            headers: {
              Authorization: token
          }}).then((function(res) {
            let tmprooms = res.data;
            
            
            
            this.rooms = this.rooms.filter((function ( el )
            {
              for(let i = 0; i < tmprooms.length; i++)
              {
                if (tmprooms[i].roomName == el.roomName)
                {
                  return false;
                }
              }
              return true;
            }));

          }).bind(this))
          .catch(error => {

          });
        }).bind(this))
        .catch(error => {

        });
          
      }
    }
  }
</script>

<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
          <v-avatar
            class="d-block text-center mx-auto mt-4"
            color="primary"
            size="36"
          >
            
            <v-btn
              class="avatar-padding settings"
              min-width="36px"
              :elevation="1"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
              dark
              >mdi-format-list-bulleted</v-icon>
            </v-btn>
          </v-avatar>
        
      </template>
      <v-card>
        <v-card-title v-if="error == true"  class="justify-center">
          <span class="red--text text-h5">Please try again!</span>
        </v-card-title>
        <v-card-title class="justify-center">
          <span class="text-h5">List of rooms</span>
        </v-card-title>
        <v-card-text>
          <div v-for="r in rooms"
                v-if="r.state == 1"
                :key="r.id">
              <v-list-group
                no-action
                sub-group
                
              >

                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title>{{r.roomName}}</v-list-item-title>
                    </v-list-item-content>
                  </template>

                  <v-list-item
                    link
                  >
                    <v-list-item-title >
                      <v-text-field @keyup.enter="trypassword(r.roomName)" v-model="roompassword" label="Room password"></v-text-field>
                    </v-list-item-title>
                  </v-list-item>
              </v-list-group>
            </div>
              <v-list
                class="pl-14"
              >
                <v-list-item-group>
                  <v-list-item
                    v-for="r in rooms"
                    :key="r.id"
                    v-if="r.state == 0"
                    link
                  >
                    <v-list-item-content  @click="joinRoom(r.roomName)">
                      <v-list-item-title v-text="r.roomName"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>



<style lang="scss" scoped>

.avatar-padding
{ 
  padding: 0 !important;
}
.settings
{
  height: 38px;
  background-color: rgba(0, 0, 0, 0.2);
}

</style>