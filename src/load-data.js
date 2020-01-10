'use strict'

const DEFAULT_LOCALSTORAGE_PREFIX = 'SPLITIO'

export default function loadDataIntoLocalStorage ({
  serializedData = {},
  userId = '',
  storagePrefix = ''
}, windowLocalStorage = window.localStorage) {
  const localStoragePrefix = storagePrefix ? `${storagePrefix}.${DEFAULT_LOCALSTORAGE_PREFIX}` : DEFAULT_LOCALSTORAGE_PREFIX
  const tillKey = `${localStoragePrefix}.splits.till`

  if (!('segmentsData' in serializedData) ||
    !('since' in serializedData) ||
    !('splitsData' in serializedData) ||
    !('usingSegmentsCount' in serializedData)) {
    return
  }
  const { segmentsData, since, splitsData, usingSegmentsCount } = serializedData

  // Do not load data if current localStorage data is more recent
  if (since <= windowLocalStorage.getItem(tillKey)) {
    return
  }
  // Split.IO recommends cleaning up the localStorage data
  Object.keys(windowLocalStorage).forEach(key => {
    if (key.includes(localStoragePrefix)) {
      windowLocalStorage.removeItem(key)
    }
  })
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
}
