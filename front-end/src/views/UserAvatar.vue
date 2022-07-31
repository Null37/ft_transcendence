<template>
    <v-navigation-drawer
        v-model="drawer"
        absolute

        mini-variant
      >
        <v-avatar
          class="d-block text-center mx-auto mt-4"
          color="primary"
          size="36"
        >
          <img
            alt="Avatar"
            src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
          >
        </v-avatar>

        <v-divider class="mx-3 my-5"></v-divider>

        <v-avatar
          v-for="n in 6"
          :key="n"
          class="d-block text-center mx-auto mb-9"
          color="grey lighten-1"
          size="28"
        ></v-avatar>
      </v-navigation-drawer>
</template>