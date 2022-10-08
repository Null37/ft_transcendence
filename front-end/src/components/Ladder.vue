<script lang="ts">
  import axios from 'axios';
  
  export default {
    mounted (){

    },
    data: () => ({
      ladder: false,
      headers: [
          {
            text: 'Username',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Wins', value: 'wins' },
          { text: 'Loses', value: 'loses' },
          { text: 'XP', value: 'xp' },
        ],
        userdata: [
            {
                name: 'Akira',
                wins: 10,
                loses: 6,
                xp: 304,
            },
        ]

    }),
    methods: {
        activate: function(){
            this.ladder = true;
        }
    }
  }
</script>

<template>
    <div class="text-center">
      <v-dialog
        v-model="ladder"
        width="500"
      >
        <template v-slot:activator="{ on, attrs }">
            <v-list-item
                    link
                    @click="activate()"
                >
                    <v-list-item-content>
                    <v-list-item-title class="text-left">Ladder</v-list-item-title>
                    </v-list-item-content>
                    
                </v-list-item>
        </template>
  
        <v-card>
          <v-card-title class="text-h5 lighten-2">
            Ladder
          </v-card-title>
  
          <v-card-text>
            <v-data-table
                :headers="headers"
                :items="userdata"
                :items-per-page="10"
                class="elevation-1"
            ></v-data-table>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="ladder = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>