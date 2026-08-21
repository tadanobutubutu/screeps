import { getCurrentTab } from '.'
import { getCurrentWindow as getCurrentWindowInternal } from 'main'
import { isDefined as isDefinedInternal } from 'utils'

<<<<<<< HEAD
const { getCurrentWindow } = require('@remote/system')
=======
const getCurrentWindow = (args) => {
  const currentWindow = getCurrentWindowInternal()
  return currentWindow
    .map((w) => ({
      ...w,
      tabs: getCurrentTab()
    }))
}

// ... (existing code remains unchanged)
>>>>>>>
exports.getCurrentWindow =