import { assertType } from '@/plugins/Common'

export function getStorage(key, expectedType, defaultValue) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (data) => {
      if (!data || typeof data[key] === 'undefined') {
        if (typeof defaultValue === 'undefined') {
          reject(`item "${key}" not stored`)
          return
        }
        resolve(defaultValue)
        return
      }

      if (!assertType(data[key], expectedType)) {
        reject(`item "${key}"'s type is not as expected`)
        return
      }

      resolve(data[key])
    })
  })
}

export function setStorage(key, value) {
  return new Promise((resolve, reject) => {
    const object = {}

    object[key] = value

    chrome.storage.local.set(object, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
        return
      }

      resolve(true)
    })
  })
}
