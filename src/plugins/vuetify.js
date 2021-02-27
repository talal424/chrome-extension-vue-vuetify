import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

const opts = {
  icons: {
    iconfont: 'mdiSvg'
  },
  theme: {
    themes: {
      light: {},
      dark: {
        primary: colors.indigo.base
      }
    }
  }
}

export default new Vuetify(opts)
