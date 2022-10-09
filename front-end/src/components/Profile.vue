<script lang="ts">
  import axios from 'axios';
  
  export default {
    mounted (){
      const token = localStorage.getItem('token');

      if (token)
      {
        axios.get('/get_history/'+this.id, {
          headers: {
            Authorization: token
          }
        }).then((function (res) {
          this.games = res.data;
        }).bind(this))
        .catch(error => {
        });
        axios.get('/get_achievm/'+this.id, {
          headers: {
            Authorization: token
          }
        }).then((function (res) {
          this.ach = res.data;
        }).bind(this))
        .catch(error => {
        });
      }
    },
    data: () => ({
      dialog: false,
      games: [],
      ach: [],
      uri: 'http://'+process.env.VUE_APP_HOSTIP+':'+3000,
    }),
    props: ['avatar', 'username', 'id']
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
        <v-btn
              v-bind="attrs"
              v-on="on"
              size="40"
              class="justify-center"
              >
          <v-avatar size="40">
            <v-img :src="avatar"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-card >
        <v-card-title class="justify-center">
          <span class="text-h5">User Profile</span>
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
              <v-col align="center"
                justify="center">
                 <div class="text-h6">
                      {{username}}
                </div>
              </v-col>
              
            </v-row>
            <v-row>
              <v-col v-if="ach.length !== 0 && ach[0].conquer !== ''" align="center"
                justify="center">
                <v-avatar tile size="30">
                    <img
                        :src="uri+ach[0].conquer"
                        alt="Conquer"
                    >
                </v-avatar>
              </v-col>

              <v-col v-if="ach.length !== 0 && ach[0].first_win !== ''" align="center"
                justify="center">
                <v-avatar tile size="30">
                    <img
                        :src="uri+ach[0].first_win"
                        alt="First Win"
                    >
                </v-avatar>
              </v-col>
              
              
            </v-row>
            <v-divider style="margin-top: 10px; margin-bottom: 10px;"></v-divider>
            <v-row>
              
              <v-col align="center"
                justify="center">
                <div v-if="games.length === 0" class="text-subtitle-1">
                      No history found
                </div>
                <div v-for="game in games" class="text-subtitle-1">
                      {{game.player_one.username}} {{game.score_one}}-{{game.score_two}} {{game.player_two.username}}
                </div>
   
              </v-col>
              
            </v-row>
          </v-container>
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

</style>