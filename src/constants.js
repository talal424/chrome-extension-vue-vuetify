export const CONTENT_ACTIONS = {
  PRINT_CONSOLE: 'print-console',
  SHOPEE_GET_SHOP_MERCHANDISES: 'shopee-get-shop-merchandises',
  SCAN_TILL_END_GET_BODY: 'scan-till-end-get-body',
  EXPORT_MERCHANDISE_EXCEL: 'export-merch-xlsx'
}

export const SHOPEE_CONF_TW = {
  CURRENCY_RATIO: 1e5,
  API_URL: 'https://shopee.tw/api',
  MALL_URL_REGEX: /https:\/\/shopee.tw\/([a-zA-Z0-9\_]+)[\?.*]?/,
  IMG_SRC_PREFIX: 'https://cf.shopee.tw/file/'
}

export const BACKGROUND_ACTIONS = {
  DOWNLOAD_BUFFER: 'download-buffer'
}
