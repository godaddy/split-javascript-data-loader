'use strict'

module.exports = function loadDataIntoLocalStorage ({ serializedData = {} }) {
  const { userId, splitsData, segmentsData, usingSegmentsCount, till } = serializedData

  // Do not load data if current localStorage data is more recent
  if (till <= localStorage.getItem('SPLITIO.splits.till')) {
    return
  }
  localStorage.clear()
  localStorage.setItem('SPLITIO.splits.till', till)

  // splitsData in an object where the property is the split name and the pertaining value is a stringified json of its data
  Object.keys(splitsData).forEach(splitName => {
    localStorage.setItem(`SPLITIO.split.${splitName}`, splitsData[splitName]);
  });

  localStorage.setItem('SPLITIO.splits.usingSegments', usingSegmentsCount)
  // segmentsData in an object where the property is the segment name and the pertaining value is an array of userIds
  Object.keys(segmentsData).forEach(segmentName => {
    const key = `${userId}.SPLITIO.segment.${segmentName}`;
    if (segmentsData[segmentName].includes(userId) && localStorage.getItem(key) === '1') {
      localStorage.setItem(key, '1');
    }
  });
}
