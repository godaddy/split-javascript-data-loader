'use strict'

const { expect } = require('chai')

const loadDataIntoLocalStorage = require('./load-data')

describe('lib.load-data.loadDataIntoLocalStorage', () => {
  it('should throw a not implemented error', () => {
    try {
      loadDataIntoLocalStorage({})
    } catch (e) {
      return expect(e.message).equals('Not implemented')
    }
    throw new Error('Test didn\'t throw')
  })
})
