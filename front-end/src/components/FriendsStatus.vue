<script lang="ts">
import UserMenu from "./UserMenu.vue";
  export default {
    data: () => ({
        selectedItem: 1,
        items: [
            { status: "Online", text: "Real-Time", icon: "mdi-clock" },
            { status: "Offline", text: "Audience", icon: "mdi-account" },
            { status: "In-Game", text: "Conversions", icon: "mdi-flag" },
        ],
    }),
    components: { UserMenu }
}
</script>

<template>
    <v-navigation-drawer
      app
      clipped
      right
    >
      <v-list dense>
      <v-subheader>Friends</v-subheader>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
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
              v-if="item.status === 'Online'"
              color="success"
              dot
            ></v-badge>
            <v-badge
              bottom
              v-else-if="item.status === 'Offline'"
              color="grey"
              dot
            ></v-badge>
            <v-badge
              bottom
              v-else-if="item.status === 'In-Game'"
              color="red"
              dot
            ></v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
    </v-list>
    <v-list dense>
      <v-subheader>Users</v-subheader>
        
        <v-list-item
          v-for="i in 10"
          :key="i"
          link
        >
        <UserMenu />
        </v-list-item>
    </v-list>
    </v-navigation-drawer>
</template>