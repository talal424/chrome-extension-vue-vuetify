<template>
  <v-app>
    <v-app-bar color="primary" app dense dark>
      <v-toolbar-title>Option Page</v-toolbar-title>
      <v-spacer />

      <NightMode />
    </v-app-bar>
    <v-card> <v-card-text> Option Content </v-card-text> </v-card>
  </v-app>
</template>

<script>
import NightMode from '#/NightMode'
const browser = require('webextension-polyfill')

export default {
  components: {
    NightMode
  },
  data() {
    return {
      settings: {}
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/options.scss';
</style>
