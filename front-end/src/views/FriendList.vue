<template>
    <v-list
        class="pl-14"
        shaped
      >
        <v-list-item
          v-for="n in 10"
          :key="n"
          link
        >
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
</template>

