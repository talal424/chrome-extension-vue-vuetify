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
        console.log(sender)
        return sendResponse(document.body.innerHTML)

      case 'scan_till_end':
        let scannerInterval = null
        let currentScrollY = window.scrollY
        let scrollCount = 0
        let scan = function () {
          window.scrollBy(0, window.innerHeight)
          if (window.scrollY === currentScrollY) {
            clearInterval(scannerInterval)
          } else {
            currentScrollY = window.scrollY
            scrollCount += 1
          }
        }
        scannerInterval = setInterval(scan, 200)
        items = document.body.getElementsByClassName(
          'shop-search-result-view__item col-xs-2-4'
        )

        arr = Array.prototype.slice.call(items)
        sendResponse(arr.map((e) => e.innerHTML))

      default:
        console.log(`%c ${projectTitle}`, 'color: #680035;')
    }
  }
})
