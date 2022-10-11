const projectTitle = 'Grand Migrator'
const browser = require('webextension-polyfill')
import { CONTENT_ACTIONS } from '../constants'
import { ShopeeUtils } from './shopeeUtils'

browser.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function (msg) {
    if (port.name === 'popup') {
      if (msg) {
        switch (msg.action) {
          case CONTENT_ACTIONS.PRINT_CONSOLE:
            console.log(`%c ${msg.value}`, 'font-weight: bold; color: #680035;')
            break
          case CONTENT_ACTIONS.SHOPEE_GET_SHOP_TAB:
            const shopId = await ShopeeUtils.queryUserShop(msg.userName)
            const shopTab = await ShopeeUtils.queryShopTab(shopId)
            // port.postMessage({ result: 'ok', data: shopTab })
            for (const customClass of shopTab.customClasses) {
              for (const merchandise of customClass?.merchandises || []) {
                merchandise.items = await ShopeeUtils.queryShopItem(
                  shopId,
                  merchandise.merchandiseId
                )
              }
            }
            port.postMessage({ result: 'ok', data: shopTab })
            break
          case CONTENT_ACTIONS.SCAN_TILL_END_GET_BODY:
            // end of page: return found merchandise items
            let scannerInterval = null
            let currentScrollY = window.scrollY
            let scrollCount = 0
            let scan = function () {
              window.scrollBy(0, window.innerHeight)
              if (window.scrollY === currentScrollY) {
                clearInterval(scannerInterval)
                let items = document.body.getElementsByClassName(
                  'shop-search-result-view__item col-xs-2-4'
                )
                let arr = Array.prototype.slice.call(items)
                port.postMessage({
                  result: 'ok',
                  items: arr.map((elem) => elem.innerHTML)
                })
              } else {
                // still at middle of a page, continue scan
                currentScrollY = window.scrollY
                scrollCount += 1
              }
            }
            scannerInterval = setInterval(scan, 150)

          default:
            console.log(`%c ${projectTitle}`, 'color: #680035;')
        }
      }
    }
  })
})
