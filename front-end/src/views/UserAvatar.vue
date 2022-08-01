<template>
    <v-navigation-drawer
        v-model="drawer"
        absolute

        mini-variant
      >
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
              v-bind="attrs"
              v-on="on"
              class="settings avatar-padding"
              min-width="36px"
              :elevation="1"
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
        <v-divider class="mx-3 my-5"></v-divider>
        <v-hover
        v-slot="{ hover }"
        v-for="n in 6"
        :key="n"
        >
          <v-avatar
            class="d-block text-center mx-auto mb-9"
            color="grey lighten-1"
            :class="{ 'on-hover': hover }"
            size="28"
          ></v-avatar>
        </v-hover>
        <v-dialog v-model="dialog" fullscreen scrollable>
          <v-card>
            This is a test
          </v-card>
        </v-dialog>
      </v-navigation-drawer>
</template>

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
  display: none;
  background-color: rgba(0, 0, 0, 0.2);
}

.v-avatar.on-hover > .settings
{
  display: inline-flex;
}
</style>
