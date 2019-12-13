'use strict'

import { SEGMENT_SUB_KEY, SPLIT_SUB_KEY, TILL, USING_SEGMENTS } from './localStorage-keys'

export default function loadDataIntoLocalStorage ({ serializedData = {} }) {
  const { segmentsData, since, splitsData, userId, usingSegmentsCount } = serializedData
  const windowLocalStorage = window.localStorage

  // Do not load data if current localStorage data is more recent
  if (since <= windowLocalStorage.getItem(TILL)) {
    return
  }
  windowLocalStorage.clear()
  windowLocalStorage.setItem(TILL, since)

  // splitsData in an object where the property is the split name and the pertaining value is a stringified json of its data
  Object.keys(splitsData).forEach(splitName => {
    windowLocalStorage.setItem(`${SPLIT_SUB_KEY}.${splitName}`, splitsData[splitName])
  })

  windowLocalStorage.setItem(USING_SEGMENTS, usingSegmentsCount)
  // segmentsData in an object where the property is the segment name and the pertaining value is an array of userIds
  Object.keys(segmentsData).forEach(segmentName => {
    const key = `${userId}.${SEGMENT_SUB_KEY}.${segmentName}`
    if (segmentsData[segmentName].includes(userId) && windowLocalStorage.getItem(key) !== '1') {
      windowLocalStorage.setItem(key, '1')
    }
  })
}
