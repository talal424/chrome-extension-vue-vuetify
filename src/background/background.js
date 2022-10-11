const browser = require('webextension-polyfill')
import { BACKGROUND_ACTIONS } from '../constants'

browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  switch (msg.action) {
    case BACKGROUND_ACTIONS.DOWNLOAD_BUFFER:
      browser.downloads.download({ url: msg.url })
      break
    default:
  }
})
