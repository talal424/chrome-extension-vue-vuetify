import { getStorage, setStorage } from '@/plugins/Storage'

setStorage('backgroundScriptKey', [1, 2, 3])
  .then(() => console.log('background script item stored'))
  .then(() => {
    getStorage('backgroundScriptKey', Array).then((value) =>
      console.log(`background script item retrieved`, value)
    )
  })
