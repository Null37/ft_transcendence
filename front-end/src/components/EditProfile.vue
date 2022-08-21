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
            class="d-block text-center mx-auto mt-4"
            color="primary"
            size="36"
            :class="{ 'on-hover': hover }"
          >
            
            <v-btn
              class="settings avatar-padding"
              min-width="36px"
              :elevation="1"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
              dark
              >mdi-cog</v-icon>
            </v-btn>
            <img
              :elevation="2"
              alt="Avatar"
              :src="avatar"
            >
          </v-avatar>
        </v-hover>
        
      </template>
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5">Edit your profile</span>
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
                <v-text-field
                  label="Username*"
                  v-model="usernameEdit"
                  required
                ></v-text-field>
                <!-- <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pick an avatar"
                    prepend-icon="mdi-camera"
                    @change="loadImage($event)"
                    label="Avatar"
                    v-model="image"
                ></v-file-input> -->
                <input ref="file" type="file" accept="image/*" @submit.prevent @change="loadImage($event)" />
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
            @click="updateusername(); dialog = false"
          >
            Save
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import axios from 'axios';

  export default {
    props: ['avatar'],
    data: () => ({
      usernameEdit: "",
      linkavatar: "",
      intra_login: "",
      status: "",
      username: "",
      image: null,
      dialog: false,
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
          }).then(res => {
            console.log("image updated");
          }).catch(error => {
            console.log(error);
          });
        }
      },
      updateusername: function()
      {
        if (this.usernameEdit.length >= 5 && this.usernameEdit.length <= 10 && this.usernameEdit !== this.username)
        {
          const token = localStorage.getItem('token');

          if (token)
          {
            axios.patch('/update', {
              username: this.usernameEdit,
            }, {
              headers: {
                Authorization: token
              }
            }).then(res => {
              this.username = this.usernameEdit;
            })
            .catch(error => {
              console.log(error);
            });
          }
          
        }
        this.dialod = false;
        console.log(this.dialod);
      }
    },
    mounted (){
      const token = localStorage.getItem('token');
    
      if (token)
      {
        axios.get('/user/me', {
          headers: {
            Authorization: token
        }}).then(res => {
          this.linkavatar = res.data.avatar;
          this.username = res.data.username;
          this.usernameEdit = this.username;
          this.intra_login = res.data.intra_login;
          this.status = res.data.status;
        })
        .catch(error => {
          console.log(error);
        });
      }

    }
  }
</script>

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
  height: 38px;
  display: none;
  background-color: rgba(0, 0, 0, 0.2);
}

.v-avatar.on-hover > .settings
{
  display: inline-flex;
}
</style>