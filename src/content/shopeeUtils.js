import { SHOPEE_CONF_TW } from '../constants'
const XLSX = require('xlsx')
export class ShopeeUtils {
  constructor() {}
  static async queryUserShop(userName) {
    let shopeeShopDetailXHR = new XMLHttpRequest()
    const query = { username: userName }
    shopeeShopDetailXHR.open(
      'GET',
      `${SHOPEE_CONF_TW.API_URL}/v4/shop/get_shop_detail?${new URLSearchParams(
        query
      ).toString()}`,
      false
    )
    await shopeeShopDetailXHR.send()
    const shopDetailResponse = JSON.parse(shopeeShopDetailXHR.response)
    const shopId = shopDetailResponse.data.shopid
    return shopId
  }

  static async queryShopTab(shopId) {
    let shopeeShopTabXHR = new XMLHttpRequest()
    shopeeShopTabXHR.open(
      'POST',
      `${SHOPEE_CONF_TW.API_URL}/v4/shop/get_shop_tab`,
      false
    )
    shopeeShopTabXHR.setRequestHeader('Content-type', 'application/json')
    await shopeeShopTabXHR.send(
      JSON.stringify({
        entry_point: '',
        version: 2,
        shopid: parseInt(shopId)
      })
    )
    const shopeeShopTab = JSON.parse(shopeeShopTabXHR.response).data
    const arrangedResult = {
      customClasses: shopeeShopTab.decoration
        .filter((_dec) => _dec.type === 6 && _dec.product_by_category)
        .map((_dec) => ({
          shopeeCategoryId: _dec.product_by_category.shop_category_id,
          name: _dec.product_by_category.display_name,
          merchandises: _dec.product_by_category.items.map((_itm) => ({
            merchandiseId: _itm.itemid,
            name: _itm.name,
            coverPhotoUrl: _itm.image || null,
            photoUrls: Array.isArray(_itm.images) ? _itm.images : [],
            currency: _itm.currency,
            stock: _itm.stock,
            sellPrice: parseInt(
              (_itm.price || 0) / SHOPEE_CONF_TW.CURRENCY_RATIO
            ),
            originalPrice: parseInt(
              (_itm.price_before_discount || _itm.price) /
                SHOPEE_CONF_TW.CURRENCY_RATIO
            )
          }))
        })),
      topProducts: shopeeShopTab.decoration
        .find((_dec) => _dec.type === 14 && _dec.top_products)
        ?.top_products?.items?.map((_itm) => ({
          merchandiseId: _itm.itemid,
          name: _itm.name,
          coverPhotoUrl: _itm.image || null,
          photoUrls: Array.isArray(_itm.images) ? _itm.images : [],
          currency: _itm.currency,
          stock: _itm.stock,
          sellPrice: parseInt(
            (_itm.price || 0) / SHOPEE_CONF_TW.CURRENCY_RATIO
          ),
          originalPrice: parseInt(
            (_itm.price_before_discount || _itm.price) /
              SHOPEE_CONF_TW.CURRENCY_RATIO
          )
        }))
    }
    return arrangedResult
  }

  static _checkFreezeItem(merchandiseString) {
    var count = (merchandiseString.match(/冷凍/g) || []).length
    return count > 2
  }

  static async queryShopItem(shopId, itemId) {
    let shopeeItemQueryXHR = new XMLHttpRequest()
    const query = { shopid: shopId, itemid: itemId }
    shopeeItemQueryXHR.open(
      'GET',
      `${SHOPEE_CONF_TW.API_URL}/v4/item/get?${new URLSearchParams(
        query
      ).toString()}`,
      false
    )
    await shopeeItemQueryXHR.send()
    const shopeeItemResponse = JSON.parse(shopeeItemQueryXHR.response)
    const data = shopeeItemResponse.data
    return {
      desc: data.description,
      isFreezeCheck: this._checkFreezeItem(shopeeItemQueryXHR.response),
      items: Array.isArray(data.models)
        ? data.models.map((_model) => ({
            modelId: _model.modelid,
            name: _model.name,
            stock: _model.stock,
            sellPrice: _model.price / SHOPEE_CONF_TW.CURRENCY_RATIO,
            originalPrice:
              (_model.price_before_discount || _model.price) /
              SHOPEE_CONF_TW.CURRENCY_RATIO
          }))
        : []
    }
  }

  static exportMerchandises(merchandises) {
    const AOAData = [
      [
        '名稱',
        '溫層',
        '售價',
        '優惠價',
        '庫存',
        '商品規格',
        '分類',
        '建立日期',
        '自訂貨號',
        '封面URL',
        '子照片1URL',
        '子照片2URL',
        '子照片3URL',
        '子照片4URL',
        '子照片5URL',
        '子照片6URL',
        '子照片7URL',
        '子照片8URL',
        '商品描述',
        '商品Tag'
      ]
    ]
    for (const merchandise of merchandises) {
      for (const item of merchandise.items) {
        AOAData.push([
          merchandise.name,
          merchandise.isFreezeCheck ? '冷凍' : '常溫',
          item.originalPrice || merchandise.originalPrice || 0,
          item.sellPrice || merchandise.sellPrice || 0,
          item.stock || 0,
          item.name || '',
          '', // get category?
          new Date(),
          merchandise.merchandiseId,
          `${SHOPEE_CONF_TW.IMG_SRC_PREFIX}${merchandise.coverPhotoUrl}`,
          merchandise.photoUrls[0]
            ? `${SHOPEE_CONF_TW.IMG_SRC_PREFIX}${merchandise.photoUrls[0]}`
            : '',
          merchandise.photoUrls[1]
            ? `${SHOPEE_CONF_TW.IMG_SRC_PREFIX}${merchandise.photoUrls[0]}`
            : '',
          merchandise.photoUrls[2]
            ? `${SHOPEE_CONF_TW.IMG_SRC_PREFIX}${merchandise.photoUrls[0]}`
            : '',
          merchandise.photoUrls[3]
            ? `${SHOPEE_CONF_TW.IMG_SRC_PREFIX}${merchandise.photoUrls[0]}`
            : '',
          merchandise.photoUrls[4]
            ? `${SHOPEE_CONF_TW.IMG_SRC_PREFIX}${merchandise.photoUrls[0]}`
            : '',
          merchandise.photoUrls[5]
            ? `${SHOPEE_CONF_TW.IMG_SRC_PREFIX}${merchandise.photoUrls[0]}`
            : '',
          merchandise.photoUrls[6]
            ? `${SHOPEE_CONF_TW.IMG_SRC_PREFIX}${merchandise.photoUrls[0]}`
            : '',
          merchandise.photoUrls[7]
            ? `${SHOPEE_CONF_TW.IMG_SRC_PREFIX}${merchandise.photoUrls[0]}`
            : '',
          merchandise.desc,
          ''
        ])
      }
    }
    const workBook = XLSX.utils.book_new()
    const workSheet = XLSX.utils.aoa_to_sheet(AOAData, {
      cellDates: true
    })
    XLSX.utils.book_append_sheet(workBook, workSheet, 'MERCH')
    const fileBuffer = XLSX.write(workBook, {
      type: 'buffer',
      bookType: 'xlsx'
    })
    var blob = new Blob([fileBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    return blob
  }
}
