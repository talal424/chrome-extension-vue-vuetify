const projectTitle = 'Grand Migrator'
const browser = require('webextension-polyfill')

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Once we receive a message from the popup
  if (request.msg) {
    // If message has the `action` key `print_in_console`
    switch (request.msg.action) {
      case 'print_in_console':
        console.log(
          `%c ${request.msg.value}`,
          'font-weight: bold; color: #680035;'
        )
        break
      case 'scrape_body':
        return Promise.resolve(document.body.innerHTML)

      default:
        console.log(`%c ${projectTitle}`, 'color: #680035;')
    }
  }
})
