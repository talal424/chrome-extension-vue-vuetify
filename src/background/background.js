const browser = require('webextension-polyfill')

browser.runtime.onConnect.addListener(function (obj) {
  console.log('onConnect')
})
