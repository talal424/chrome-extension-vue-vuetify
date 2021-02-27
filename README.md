# Template for creating chrome extensions using vue + vuetify

this is based on [Kocal/vue-web-extension](https://github.com/Kocal/vue-web-extension/) so thank you Kocal

## Installation

clone this repo and run

```bash
npm i

#then run the build command for production build or dev command for development and watch

npm run dev

# you can run command build:zip for building for production and creating a zip file of the build

npm run build:zip
```

## Aliases

`@` points to `/src/`

`#` points to `/src/components/`

## Vuetify

tree shaking is auto when building for production

[@mdi/js](https://github.com/Templarian/MaterialDesign-JS) is added and configured to be used in .vue files for example to add icon mdi-weather-night

```vue
<template>
  <v-btn icon>
    <v-icon>{{ $mdi.mdiWeatherNight }}</v-icon>
  </v-btn>
</template>
```

## Vue

you can add anything (ex: vuex, vue router) using the entry point's js file
