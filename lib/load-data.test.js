'use strict'

const { expect } = require('chai')
const sinon = require('sinon')
const { JSDOM } = require('jsdom')

const loadDataIntoLocalStorage = require('./load-data')
const { TILL, USING_SEGMENTS } = require('./localStorage-keys')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {url: "http://localhost"});
const { window } = jsdom;

describe('lib.load-data.loadDataIntoLocalStorage', () => {
  const clearSpy = sinon.spy(window.localStorage, "clear")
  beforeEach(() => {
    global.window = window;
  });
  afterEach(() => {
    clearSpy.restore()
    window.localStorage.clear()
  });
  it('should not affect localStorage if its data is more recent', () => {
    const largerSince = 'somethingLarger'
    window.localStorage.setItem(TILL, largerSince)
    const smallerSince = ''
    const serializedData = {since: smallerSince}
    loadDataIntoLocalStorage({serializedData})
    expect(clearSpy.notCalled).to.be.true
  })
})
