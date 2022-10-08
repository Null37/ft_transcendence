<script lang="ts">
import Vue from 'vue';
import EditProfile from './EditProfile.vue';
import CreateRoom from './CreateRoom.vue';
import ListRooms from './ListRooms.vue';

export default Vue.extend({
    props: ['avatar', 'rooms'],
    data: () => ({ drawer: null }),
    methods: {
      addroom: function(room)
      {
        this.$emit("Addroom", room);
        
      },
      changeAvatarC: function(avatar)
      {
        this.$emit('changeAvatar', avatar);
      }
    },
    components: { EditProfile, CreateRoom, ListRooms }
});
</script>


<template>
    <v-navigation-drawer
        v-model="drawer"
        absolute

        mini-variant
      >
        <EditProfile @changeAvatar="changeAvatarC" :avatar="avatar" />
        <v-divider class="mx-3 my-5"></v-divider>
        <v-hover
        v-slot="{ hover }"
        v-for="r in rooms"
		v-if="r.duration <= Date.now()"
        :key="r.id"
        >
          <v-avatar
            @click="$emit('showChatroom', r.roomName)"
            class="d-block mx-auto mb-9"
            color="grey darken-4"
            :class="{ 'on-hover': hover }"
            size="28"
          >
            <span class="text-h6" :title="r.roomName" >{{r.roomName.charAt(0)}}</span>
          </v-avatar>
        </v-hover>
        <CreateRoom @Addroom="addroom" />
        <ListRooms @Addroom="addroom"/>
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
