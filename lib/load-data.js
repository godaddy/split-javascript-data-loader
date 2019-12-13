'use strict'

const { SEGMENT_SUB_KEY, SPLIT_SUB_KEY, TILL, USING_SEGMENTS } = require('./localStorage-keys')

module.exports = function loadDataIntoLocalStorage ({ serializedData = {} }) {
  const { userId, splitsData, segmentsData, usingSegmentsCount, since } = serializedData
  const windowLocalStorage = window.localStorage
  console.log(serializedData);

  // Do not load data if current localStorage data is more recent
  console.log(since);
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
    if (segmentsData[segmentName].includes(userId) && windowLocalStorage.getItem(key) === '1') {
      windowLocalStorage.setItem(key, '1')
    }
  })
}
