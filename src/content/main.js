const projectTitle = 'Grand Migrator'
const browser = require('webextension-polyfill')
import { CONTENT_ACTIONS, BACKGROUND_ACTIONS } from '../constants'
import { ShopeeUtils } from './shopeeUtils'

browser.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function (msg) {
    if (port.name === 'popup') {
      if (msg) {
        switch (msg.action) {
          case CONTENT_ACTIONS.PRINT_CONSOLE:
            console.log(`%c ${msg.value}`, 'font-weight: bold; color: #680035;')
            break
          case CONTENT_ACTIONS.SHOPEE_GET_SHOP_MERCHANDISES:
            const shopId = await ShopeeUtils.queryUserShop(msg.userName)
            const shopTab = await ShopeeUtils.queryShopTab(shopId)
            const merchandises = {}

            // scan merchandise
            for (const customClass of shopTab.customClasses) {
              for (const merchandise of customClass?.merchandises || []) {
                if (merchandises[merchandise.merchandiseId]) continue
                const itemQuery = await ShopeeUtils.queryShopItem(
                  shopId,
                  merchandise.merchandiseId
                )
                merchandise.items = itemQuery.items
                merchandise.desc = itemQuery.desc
                merchandise.isFreezeCheck = itemQuery.isFreezeCheck
                merchandises[merchandise.merchandiseId] = merchandise
              }
            }
            for (const merchandise of shopTab.topProducts || []) {
              if (merchandises[merchandise.merchandiseId]) continue
              const itemQuery = await ShopeeUtils.queryShopItem(
                shopId,
                merchandise.merchandiseId
              )
              merchandise.items = itemQuery.items
              merchandise.desc = itemQuery.desc
              merchandise.isFreezeCheck = itemQuery.isFreezeCheck
              merchandises[merchandise.merchandiseId] = merchandise
            }
            port.postMessage({
              result: 'ok',
              action: msg.action,
              data: Object.values(merchandises)
            })
            break
          case CONTENT_ACTIONS.EXPORT_MERCHANDISE_EXCEL:
            if (Array.isArray(msg.merchandises)) {
              const blob = await ShopeeUtils.exportMerchandises(
                msg.merchandises
              )
              var url = URL.createObjectURL(blob)

              browser.runtime.sendMessage({
                action: BACKGROUND_ACTIONS.DOWNLOAD_BUFFER,
                url: url
              })
            }
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
                  action: msg.action,
                  data: arr.map((elem) => elem.innerHTML)
                })
              } else {
                // still at middle of a page, continue scan
                currentScrollY = window.scrollY
                scrollCount += 1
              }
            }
            scannerInterval = setInterval(scan, 150)
            break

          default:
            console.log(`%c ${projectTitle}`, 'color: #680035;')
        }
      }
    }
  })
})
