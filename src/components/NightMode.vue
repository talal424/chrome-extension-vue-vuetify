<template>
  <v-btn icon :aria-label="nm.title" :title="nm.title" @click.stop="setTheme">
    <v-icon>{{ nm.icon }}</v-icon>
  </v-btn>
</template>

<script>
import { getStorage, setStorage } from '@/plugins/Storage'

export default {
  name: 'NightMode',
  computed: {
    nm() {
      const isDark = this.$vuetify.theme.dark
      return {
        title: (isDark ? 'Disable' : 'Enable') + ' night mode',
        icon: isDark
          ? this.$mdi.mdiWhiteBalanceSunny
          : this.$mdi.mdiWeatherNight
      }
    }
  },
  created() {
    getStorage('nightMode', Boolean, false).then(
      (value) => (this.$vuetify.theme.dark = value)
    )
  },
  methods: {
    setTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      setStorage('nightMode', this.$vuetify.theme.dark)
    }
  }
}
</script>
