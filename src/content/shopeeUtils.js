export class ShopeeUtils {
  constructor() {}
  static async queryUserShop(query) {
    let shopeeShopDetailXHR = new XMLHttpRequest()
    shopeeShopDetailXHR.open(
      'GET',
      `https://shopee.tw/api/v4/shop/get_shop_detail?${new URLSearchParams(
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
      'https://shopee.tw/api/v4/shop/get_shop_tab',
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
      categories: [
        shopeeShopTab.decoration
          .filter((_dec) => _dec.type === 6 && _dec.product_by_category)
          .map((_dec) => ({
            categoryId: _dec.product_by_category.shop_category_id,
            categoryName: _dec.product_by_category.display_name,
            merchandises: [
              _dec.product_by_category.items.map((_itm) => ({
                itemId: _itm.itemid,
                name: _itm.name,
                coverPhotoUrl: _itm.image,
                photoUrls: _itm.images,
                currency: _itm.currency,
                stock: _itm.stock,
                sellPrice: parseInt((_itm.price || 0) / 1e5),
                originalPrice: parseInt((_itm.price || 0) / 1e5)
              }))
            ]
          }))
      ]
    }
    return arrangedResult
  }
}
