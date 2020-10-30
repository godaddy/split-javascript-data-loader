'use strict'

const DEFAULT_LOCALSTORAGE_PREFIX = 'SPLITIO'

export default function loadDataIntoLocalStorage ({
  serializedData = {},
  userId = '',
  storagePrefix = ''
}, windowLocalStorage = window.localStorage) {
  const localStoragePrefix = storagePrefix ? `${storagePrefix}.${DEFAULT_LOCALSTORAGE_PREFIX}` : DEFAULT_LOCALSTORAGE_PREFIX
  const tillKey = `${localStoragePrefix}.splits.till`

  // Do not load data if current serializedData is empty
  if (Object.keys(serializedData).length === 0) {
    return
  }

  const { segmentsData = {}, since = 0, splitsData = {}, usingSegmentsCount = 0 } = serializedData

  // Do not load data if current localStorage data is more recent
  if (since <= windowLocalStorage.getItem(tillKey)) {
    return
  }
  // Split.IO recommends cleaning up the localStorage data
  cleanLocalStorage({ windowLocalStorage, localStoragePrefix })

  try {
    windowLocalStorage.setItem(tillKey, since)

    // splitsData in an object where the property is the split name and the pertaining value is a stringified json of its data
    Object.keys(splitsData).forEach(splitName => {
      windowLocalStorage.setItem(`${localStoragePrefix}.split.${splitName}`, splitsData[splitName])
    })

    windowLocalStorage.setItem(`${localStoragePrefix}.splits.usingSegments`, usingSegmentsCount)
    // segmentsData in an object where the property is the segment name and the pertaining value is a stringified object that contains the `added` array of userIds
    Object.keys(segmentsData).forEach(segmentName => {
      const key = `${userId}.${localStoragePrefix}.segment.${segmentName}`
      const added = JSON.parse(segmentsData[segmentName]).added
      if (added.includes(userId) && windowLocalStorage.getItem(key) !== '1') {
        windowLocalStorage.setItem(key, '1')
      }
    })
  } catch (err) {
    console.error('Error setting localstorage', err)
    // Clean any partial data loaded already
    cleanLocalStorage({
      windowLocalStorage,
      localStoragePrefix
    })
  }
}

export function cleanLocalStorage ({
  windowLocalStorage = window.localStorage,
  localStoragePrefix
}) {
  Object.keys(windowLocalStorage).forEach(key => {
    if (key.includes(localStoragePrefix)) {
      windowLocalStorage.removeItem(key)
    }
  })
}
