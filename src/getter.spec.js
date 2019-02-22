'use strict'

const assert = require('chai').assert

const GetterBaseClass = require('./GetterBaseClass')

describe('getter => ', () => {
  let currGetterList = []
  let inputArr = []
  let getter = new GetterBaseClass()

  beforeEach(() => {
    inputArr.length = 0
  })

  describe('chaining of getters work', () => {
    before(() => {
      currGetterList.push('asLower', 'asBoolean')
    })

    after(() => {
      currGetterList.length = 0
    })

    it('lower case the literal "tRue" and get boolean value', () => {
      inputArr.push('tRue')
      inputArr.forEach((elem, index) => {
        assert.strictEqual(getter.exec(elem, currGetterList), true, 'failed for input => ' + elem)
      })
    })
  })
})
