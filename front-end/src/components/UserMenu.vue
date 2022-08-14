<template>
  <v-row justify="space-around">
    <v-menu
      offset-y
    >
      <template v-slot:activator="{ attrs, on }">

          <v-list-item
            v-bind="attrs"
            v-on="on"
            link
          
        >
          <v-list-item-icon>

           <v-avatar
              color="indigo"
              size="24"
            >
               <img
                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                        alt="John"
                    >
            </v-avatar>
            <v-badge
              bottom
              color="grey"
              dot
            ></v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Null37</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-list>
        <v-list-item
          link
        >
          <v-list-item-title >Add friend</v-list-item-title>
        </v-list-item>
         <v-list-item
          link
        >
          <v-list-item-title >Mute</v-list-item-title>
        </v-list-item>
         <v-list-item
          link
        >
          <v-list-item-title >Ban</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-row>
</template>

<script>
  export default {
    data: () => ({
      btns: [
        ['Removed', '0'],
        ['Large', 'lg'],
        ['Custom', 'b-xl'],
      ],
      colors: ['deep-purple accent-4', 'error', 'teal darken-1'],
      items: [...Array(4)].map((_, i) => `Item ${i}`),
    }),
  }
</script>