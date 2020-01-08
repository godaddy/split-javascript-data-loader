'use strict'

import { expect } from 'chai'
import sinon from 'sinon'

import loadDataIntoLocalStorage from './load-data'

const DEFAULT_SERIALIZED_DATA = { segmentsData: {}, since: 0, splitsData: {}, usingSegmentsCount: 0 }
const SMALLER_SINCE = 0
const LARGER_SINCE = 1

describe('lib.load-data.loadDataIntoLocalStorage', () => {
  let defaultSerializedData, localStorageOverride
  beforeEach(() => {
    defaultSerializedData = Object.assign({}, DEFAULT_SERIALIZED_DATA)
    localStorageOverride = {
      getItem: sinon.stub(),
      removeItem: sinon.stub(),
      setItem: sinon.stub()
    }
  })

  it('should not affect localStorage if a serializedData property is falsey', () => {
    const properties = ['segmentsData', 'since', 'splitsData', 'usingSegmentsCount']
    properties.forEach(property => {
      delete defaultSerializedData[property]

      loadDataIntoLocalStorage({ serializedData: defaultSerializedData }, localStorageOverride)

      expect(localStorageOverride.getItem.calledOnce).to.equal(false)
      expect(localStorageOverride.removeItem.called).to.equal(false)
      expect(localStorageOverride.setItem.called).to.equal(false)
      defaultSerializedData = Object.assign({}, DEFAULT_SERIALIZED_DATA)
    })
  })

  it('should not affect localStorage if its data is more recent', () => {
    localStorageOverride.getItem.returns(LARGER_SINCE)

    const serializedData = defaultSerializedData
    serializedData.since = SMALLER_SINCE
    loadDataIntoLocalStorage({ serializedData }, localStorageOverride)

    expect(localStorageOverride.getItem.calledOnce).to.equal(true)
    expect(localStorageOverride.removeItem.called).to.equal(false)
    expect(localStorageOverride.setItem.called).to.equal(false)
  })

  it('should clean up localStorage and change till to more recent value with larger since value', () => {
    const removedItemKey = 'SPLITIO.should_be_cleared'
    localStorageOverride.getItem.onFirstCall().returns(SMALLER_SINCE)
    localStorageOverride[removedItemKey] = {}

    const serializedData = { segmentsData: {}, since: LARGER_SINCE, splitsData: {}, usingSegmentsCount: 0 }
    loadDataIntoLocalStorage({ serializedData }, localStorageOverride)

    expect(localStorageOverride.removeItem.calledWith(removedItemKey)).to.equal(true)
    expect(localStorageOverride.setItem.firstCall.calledWith('SPLITIO.splits.till', LARGER_SINCE)).to.equal(true)
  })

  it('should load serialized split data into localStorage properly', () => {
    const serializedExperimentOne = 'serialized_experiment_1'
    const serializedExperimentTwo = 'serialized_experiment_2'
    const splitsData = {
      experiment_1: serializedExperimentOne,
      experiment_2: serializedExperimentTwo
    }
    localStorageOverride.getItem.onFirstCall().returns(SMALLER_SINCE)

    const serializedData = { segmentsData: {}, since: LARGER_SINCE, splitsData, usingSegmentsCount: 0 }
    loadDataIntoLocalStorage({ serializedData }, localStorageOverride)

    expect(localStorageOverride.setItem.calledWith('SPLITIO.split.experiment_1', serializedExperimentOne)).to.equal(true)
    expect(localStorageOverride.setItem.calledWith('SPLITIO.split.experiment_2', serializedExperimentTwo)).to.equal(true)
  })

  it('should load segments data into localStorage properly', () => {
    const userId = 'visitor_guid_1'
    const usingSegmentsCount = 2
    const segmentsData = {
      segment_1: `{ "name": "segment_1", "added": ["${userId}", "visitor_guid_2"] }`,
      segment_2: `{ "name": "segment_2", "added": ["${userId}", "visitor_guid_3"] }`
    }
    localStorageOverride.getItem.onFirstCall().returns(SMALLER_SINCE)

    const serializedData = { segmentsData, since: LARGER_SINCE, splitsData: {}, usingSegmentsCount }
    loadDataIntoLocalStorage({ serializedData, userId, localStorageUserId: userId }, localStorageOverride)

    expect(localStorageOverride.setItem.calledWith('SPLITIO.splits.usingSegments', usingSegmentsCount)).to.equal(true)
    expect(localStorageOverride.setItem.calledWith('visitor_guid_1.SPLITIO.segment.segment_1', '1')).to.equal(true)
    expect(localStorageOverride.setItem.calledWith('visitor_guid_1.SPLITIO.segment.segment_2', '1')).to.equal(true)
  })

  it('should load segments data into localStorage properly with localStorageUserId in key', () => {
    const localStorageUserId = 'format-visitor'
    const userId = 'visitor_guid_1'
    const segmentsData = {
      segment_1: `{ "name": "segment_1", "added": ["${userId}", "visitor_guid_2"] }`
    }
    localStorageOverride.getItem.onFirstCall().returns(SMALLER_SINCE)

    const serializedData = { segmentsData, since: LARGER_SINCE, splitsData: {}, usingSegmentsCount: 1 }
    loadDataIntoLocalStorage({ serializedData, userId, localStorageUserId }, localStorageOverride)

    expect(localStorageOverride.setItem.calledWith(`${localStorageUserId}.SPLITIO.segment.segment_1`, '1')).to.equal(true)
  })
})
