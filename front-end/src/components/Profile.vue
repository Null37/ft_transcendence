<script lang="ts">
  export default {
    data: () => ({
      dialog: false,
    }),
    props: ['avatar']
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
                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                        alt="John"
                    >
                </v-avatar>
              </v-col>
              
            </v-row>
            <v-row>
              <v-col align="center"
                justify="center">
                 <div class="text-h6">
                      Akira
                </div>
                 <div class="text-caption">
                      User since 16, march 2020
                </div>
              </v-col>
              
            </v-row>
            <v-divider style="margin-top: 10px; margin-bottom: 10px;"></v-divider>
            <v-row>
              
              <v-col align="center"
                justify="center">
                 <div class="text-subtitle-1">
                      Null37 0-10 Akira
                </div>

                <div class="text-subtitle-1">
                      Null37 0-10 Akira
                </div>

                <div class="text-subtitle-1">
                      Null37 0-10 Akira
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