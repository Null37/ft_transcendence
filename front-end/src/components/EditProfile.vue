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
        <v-card-title v-if="error == true"  class="justify-center">
          <span class="red--text text-h5">Please try again!</span>
        </v-card-title>
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
                <input ref="file" type="file" accept="image/*" @submit.prevent @change="loadImage($event)" />
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-list-group
                no-action
                sub-group
                
              >
                  <template v-slot:activator>
                    <v-list-item-content >
                      <v-list-item-title>Two Factor Authentication</v-list-item-title>
                    </v-list-item-content>
                  </template>

                  <v-avatar
                    v-if="twofactor == false"
                    class="d-block text-center mx-auto mt-4"
                    color="primary"
                    size="400"
                    tile
                  >
                    
                    <img
                      :elevation="4"
                      alt="Qr"
                      :src="QRcode"
                    >
                  </v-avatar>
                  <v-list-item
                    v-if="twofactor == false"
                    link
                  >
                    <v-list-item-title  >
                      <v-text-field v-on:keyup.enter="updateusername()" v-model="verification" label="Verification code"></v-text-field>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-else
                    link
                  >
                    <v-list-item-title  >
                      <v-btn @click="disbale2fa()" block>
                        Disable 2FA
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item>

              </v-list-group>
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
            @click="updateusername();"
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
      error: false,
      linkavatar: "",
      intra_login: "",
      status: "",
      username: "",
      image: null,
      dialog: false,
      QRcode: "",
      verification: "",
      id: -1,
      twofactor: false
    }),
    methods: {
      disbale2fa(){
        const token = localStorage.getItem('token');
        if (token) {
          axios.get("/2FA/disable", {
            headers: {
                Authorization: token
              }
          }).then((function (res) {
            this.twofactor = false;
            axios.get('/QR', {
                headers: {
                  Authorization: token
              }}).then(res => {
                this.QRcode = res.data;
              })
              .catch((function (err) {
                this.error = true;
              }).bind(this));
          }).bind(this)).catch((function (err) {
            this.error = true;
          }).bind(this));
        }
      },
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
            this.$emit('changeAvatar', res.data);
          }).bind(this)).catch((function (err) {
            this.error = true;
          }).bind(this));
        }
      },
      updateusername: function()
      {
        if (this.usernameEdit && this.usernameEdit.length >= 5 && this.usernameEdit.length <= 10 && this.usernameEdit !== this.username)
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
              this.dialod = false;
              this.error = false;
              this.username = this.usernameEdit;
            })
            .catch((function (err) {
              this.error = true;
            }).bind(this));
          }
        }
        else
          this.error = true;
        if (this.verification.length == 6)
        {
          if (/^[0-9]+$/.test(this.verification))
          {
            const data = {
              id: this.id,
              number: +this.verification
            };
  
            console.log(data);
            axios.put('/2FA/verify', data, {}).then((function (res) {
              this.dialod = false;
              this.error = false;
              this.twofactor = true;
            }).bind(this))
            .catch((function (err) {
              this.error = true;
            }).bind(this));
          }

        }
        else
          this.error = true;
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
          this.id = res.data.id;
          this.twofactor = res.data.two_factor_authentication;
        })
        .catch(error => {
        });

        axios.get('/QR', {
          headers: {
            Authorization: token
        }}).then(res => {
          this.QRcode = res.data;
        })
        .catch(error => {
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