'use strict'

import { expect } from 'chai'
import { JSDOM } from 'jsdom'

import loadDataIntoLocalStorage from './load-data'
import { TILL, USING_SEGMENTS } from './localStorage-keys'

const SMALLER_SINCE = 0
const LARGER_SINCE = 1

describe('lib.load-data.loadDataIntoLocalStorage', () => {
  beforeEach(() => {
    const { window } = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' })
    global.window = window
    window.localStorage.clear()
  })
  it('should not affect localStorage if its data is more recent', () => {
    const nonClearedItemKey = 'should_not_be_cleared'
    window.localStorage.setItem(nonClearedItemKey, true)
    window.localStorage.setItem(TILL, LARGER_SINCE)

    loadDataIntoLocalStorage({ serializedData: { since: SMALLER_SINCE } })

    expect(window.localStorage.getItem(nonClearedItemKey)).to.equal('true')
  })

  it('should clear localStorage and change till to more recent value with larger since value', () => {
    const clearedItemKey = 'should_be_cleared'
    window.localStorage.setItem(clearedItemKey, true)
    window.localStorage.setItem(TILL, SMALLER_SINCE)

    const serializedData = { segmentsData: {}, since: LARGER_SINCE, splitsData: {}, userId: '', usingSegmentsCount: 0 }
    loadDataIntoLocalStorage({ serializedData })

    expect(window.localStorage.getItem(clearedItemKey)).to.equal(null)
    expect(window.localStorage.getItem(TILL)).to.equal(LARGER_SINCE.toString())
  })

  it('should load serialized split data into localStorage properly', () => {
    const serializedExperimentOne = 'serialized_experiment_1'
    const serializedExperimentTwo = 'serialized_experiment_2'
    const splitsData = {
      experiment_1: serializedExperimentOne,
      experiment_2: serializedExperimentTwo
    }
    window.localStorage.setItem(TILL, SMALLER_SINCE)

    const serializedData = { segmentsData: {}, since: LARGER_SINCE, splitsData, userId: '', usingSegmentsCount: 0 }
    loadDataIntoLocalStorage({ serializedData })

    const resultExperimentOne = window.localStorage.getItem('SPLITIO.split.experiment_1')
    const resultExperimentTwo = window.localStorage.getItem('SPLITIO.split.experiment_2')
    expect(resultExperimentOne).to.equal(serializedExperimentOne)
    expect(resultExperimentTwo).to.equal(serializedExperimentTwo)
  })

  it('should load segments data into localStorage properly', () => {
    const userId = 'visitor_guid_1'
    const usingSegmentsCount = 2
    const segmentsData = {
      segment_1: [userId, 'visitor_guid_2'],
      segment_2: [userId, 'visitor_guid_3']
    }
    window.localStorage.setItem(TILL, SMALLER_SINCE)

    const serializedData = { segmentsData, since: LARGER_SINCE, splitsData: {}, userId, usingSegmentsCount }
    loadDataIntoLocalStorage({ serializedData })

    expect(window.localStorage.getItem(USING_SEGMENTS)).to.equal(usingSegmentsCount.toString())
    expect(window.localStorage.getItem('visitor_guid_1.SPLITIO.segment.segment_1')).to.equal('1')
    expect(window.localStorage.getItem('visitor_guid_1.SPLITIO.segment.segment_2')).to.equal('1')
  })
})
