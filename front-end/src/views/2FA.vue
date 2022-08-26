<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
    data: () => ({
      drawer: null,
      verification: "",
      error: false
    }),
    methods: {
      verify: function()
      {
        const id = localStorage.getItem('id');
        if (id.length > 1)
        {
          const str = id.substring(1)
          if (/^[0-9]+$/.test(str) && /^[0-9]+$/.test(this.verification))
          {
            const data = {
              id: +str,
              number: +this.verification
            };
            axios.put('/2FA/verify', data,{}
            ).then((function (res) {
              localStorage.setItem("token", "Bearer " + res.data.token);
              this.error = false;
              this.$router.push({ path: '/Game' })
              this.$router.go(1);
            }).bind(this))
            .catch((function (err)  {
              this.error = true;

            }).bind(this));
          }
          else
            this.error = true;

        }
        
      }
    }
});
</script>

<template>
  <v-app id="inspire">
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
            sm="8"
            md="4"
          >
            <div class="text-center">
              <span v-if="error == true" class="red--text text-h5">Error: Wrong number</span>
              <v-text-field v-model="verification" v-on:keyup.enter="verify();" label="Verification code"></v-text-field>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>