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
              src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
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
                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                        alt="John"
                    >
                </v-avatar>
              </v-col>
              
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="Username*"
                  v-model="myUsername"
                  required
                ></v-text-field>
                <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pick an avatar"
                    prepend-icon="mdi-camera"
                    label="Avatar"
                ></v-file-input>
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
            @click="updateusername()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
  export default {
    data: () => ({
      dialog: false,
      myUsername: ""
    }),
    methods: {
      updateusername()
      {
        console.log(this.myUsername);
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