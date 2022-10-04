import { mdiWhiteBalanceSunny, mdiWeatherNight, mdiSpider } from '@mdi/js'

// import all icons when developing or just dont care about size
// import * as mdi from '@mdi/js'

const mdi = {
  mdiWhiteBalanceSunny,
  mdiWeatherNight,
  mdiSpider
}

export default {
  install(Vue) {
    Vue.prototype.$mdi = mdi
  }
}
