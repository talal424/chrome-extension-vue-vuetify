import { SHOPEE_CONF_TW } from '../constants'
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
        }))
    }
    return arrangedResult
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
}
