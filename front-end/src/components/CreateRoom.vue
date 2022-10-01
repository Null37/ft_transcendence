<script lang="ts">
import axios from 'axios';

  export default {
    data: () => ({
      dialog: false,
      error: false,
      roomname: "",
      roompassword: "",
    }),
    methods: {
      creatroom: function (){

        const token = localStorage.getItem('token');
		var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (token && this.roomname && this.roomname.length > 0 && !format.test(this.roomname))
        {
          let st = 0;
          if (this.roompassword != '')
            st = 1;
          const data = {
            roomName: this.roomname,
            password: this.roompassword,
            state: st
          };
          axios.post('/rooms/create', data , {
              headers: {
                Authorization: token
              }
            }).then((function (res){
              this.$emit("Addroom", res.data.roomName);
              this.roomname = "";
              this.error = false;
              this.dialog = false;
              this.roompassword = "";
            }).bind(this))
            .catch(error => {
              this.error = true;
            });

        }
        
      },
    },
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
        <v-hover
          v-slot="{ hover }"
          >
            <v-avatar
              class="d-block mx-auto mb-9"
              color="grey darken-4"
              :class="{ 'on-hover': hover }"
              size="28"
            >
              <v-btn
              class="plus"
              v-bind="attrs"
              v-on="on"
              >
              <v-icon
              dark
              >mdi-plus</v-icon>
            </v-btn>
            </v-avatar>
          </v-hover>
      </template>
      <v-card>
        <v-card-title v-if="error == true"  class="justify-center">
          <span class="red--text text-h5">Please try again!</span>
        </v-card-title>
        <v-card-title class="justify-center">
          <span class="text-h5">Create new chat room</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              >
                <v-text-field
                  label="Room name*"
                  required
                  v-on:keyup.enter="creatroom();"
                  v-model="roomname"
                ></v-text-field>
                <v-text-field
                  label="Room Password"
                  v-on:keyup.enter="creatroom();"
                  v-model="roompassword"
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
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            
            @click="creatroom();"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style lang="scss" scoped>
.plus.on-hover
{
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.plus
{
  height: 30px !important;
  min-width: 28px !important;
  padding: 0 !important;
}

</style>