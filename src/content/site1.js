import { getStorage, setStorage } from '@/plugins/Storage'

setStorage('contentScriptKey', true)
  .then(() => console.log('content script item stored'))
  .then(() => {
    getStorage('contentScriptKey', Boolean).then((value) =>
      console.log(`content script item retrieved`, value)
    )
  })
