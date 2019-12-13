'use strict'

const { expect } = require('chai')
const sinon = require('sinon')
const { JSDOM } = require('jsdom')

const loadDataIntoLocalStorage = require('./load-data')
const { TILL, USING_SEGMENTS } = require('./localStorage-keys')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' })
const { window } = jsdom

describe('lib.load-data.loadDataIntoLocalStorage', () => {
  let clearSpy;
  beforeEach(() => {
    // clearSpy = sinon.spy(window, 'localStorage')
    // window.localStorage.clear = clearSpy
    // console.log('dom window: ', window.localStorage.clear)
    // global.window = window
  })
  afterEach(() => {
    // clearSpy.restore()
    // window.localStorage.clear()
  })
  it('should not affect localStorage if its data is more recent', () => {
    const largerSince = 1
    const smallerSince = 0
    window.localStorage.setItem(TILL, largerSince)
    const serializedData = { since: smallerSince }
    loadDataIntoLocalStorage({ serializedData })
    expect(clearSpy.notCalled).to.be.true
  })
  it('should clear localStorage if its data is not more recent than incoming data', () => {
    clearSpy = sinon.spy(window.localStorage.clear)
    window.localStorage.clear = function() {}
    global.window = window
    console.log('dom window: ', window.localStorage.clear)
    const largerSince = 1
    const smallerSince = 0
    window.localStorage.setItem(TILL, smallerSince)
    const serializedData = { userId: '', splitsData: {}, segmentsData: {}, usingSegmentsCount: 0, since: largerSince }
    loadDataIntoLocalStorage({ serializedData })
    expect(clearSpy.called).to.be.true;
    // expect(window.localStorage.clear.calledOnce).to.be.true
    // expect(clearSpy.calledOnce).to.be.true
  })
  it.only('testing', () => {
    const somethingWindow = jsdom.window;
    const clearSpyThing = sinon.spy(somethingWindow.localStorage, 'clear')
    global.window = somethingWindow
    somethingWindow.localStorage.clear()
    expect(clearSpyThing.called).to.be.true
    // window.localStorage.clear = function() {}
    // global.window = window
    // console.log('dom window: ', window.localStorage.clear)
    // const largerSince = 1
    // const smallerSince = 0
    // window.localStorage.setItem(TILL, smallerSince)
    // const serializedData = { userId: '', splitsData: {}, segmentsData: {}, usingSegmentsCount: 0, since: largerSince }
    // loadDataIntoLocalStorage({ serializedData })
    // expect(clearSpy.called).to.be.true;
    // expect(window.localStorage.clear.calledOnce).to.be.true
    // expect(clearSpy.calledOnce).to.be.true
  })
})
