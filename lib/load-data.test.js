'use strict'

const { expect } = require('chai')
const sinon = require('sinon')

const loadDataIntoLocalStorage = require('./load-data')
const { TILL, USING_SEGMENTS } = require('./localStorage-keys')

describe('lib.load-data.loadDataIntoLocalStorage', () => {
  const clearSpy = sinon.spy(window.localStorage, "clear")
  // beforeEach(() => {
  //   clearSpy = sinon.spy(global.window.localStorage, "clear")
  // });
  afterEach(() => {
    clearSpy.restore()
    window.localStorage.clear()
  });
  it('should not affect localStorage if its data is more recent', () => {
    const largerSince = 'somethingLarger'
    window.localStorage.setItem(TILL, largerSince)
    const smallerSince = ''
    loadDataIntoLocalStorage(smallerSince)
    expect(clearSpy.notCalled).to.be.true
  })
})
