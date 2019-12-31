'use strict'

const TILL_KEY = 'SPLITIO.splits.till'

export default function loadDataIntoLocalStorage ({ serializedData = {}, userId = '' }, windowLocalStorage = window.localStorage) {
  if (!serializedData) {
    return
  }

  const { segmentsData, since, splitsData, usingSegmentsCount } = serializedData
  if (!segmentsData || (!since && since !== 0) || !splitsData || (!usingSegmentsCount && usingSegmentsCount !== 0)) {
    return
  }

  // Do not load data if current localStorage data is more recent
  if (since <= windowLocalStorage.getItem(TILL_KEY)) {
    return
  }
  // Split.IO recommends cleaning up the localStorage data
  Object.keys(windowLocalStorage).forEach(key => {
    if (key.includes('SPLITIO')) {
      windowLocalStorage.removeItem(key)
    }
  })
  windowLocalStorage.setItem(TILL_KEY, since)

  // splitsData in an object where the property is the split name and the pertaining value is a stringified json of its data
  Object.keys(splitsData).forEach(splitName => {
    windowLocalStorage.setItem(`SPLITIO.split.${splitName}`, splitsData[splitName])
  })

  windowLocalStorage.setItem('SPLITIO.splits.usingSegments', usingSegmentsCount)
  // segmentsData in an object where the property is the segment name and the pertaining value is a stringified object that contains the `added` array of userIds
  Object.keys(segmentsData).forEach(segmentName => {
    const key = `${userId}.SPLITIO.segment.${segmentName}`
    const added = JSON.parse(segmentsData[segmentName]).added
    if (added.includes(userId) && windowLocalStorage.getItem(key) !== '1') {
      windowLocalStorage.setItem(key, '1')
    }
  })
}
