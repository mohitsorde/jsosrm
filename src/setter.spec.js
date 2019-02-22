'use strict'

const assert = require('chai').assert

const SetterBaseClass = require('./SetterBaseClass')

describe('setter => ', () => {
  let currSetterList = []
  let inputArr = []
  let setter = new SetterBaseClass()

  beforeEach(() => {
    inputArr.length = 0
  })

  describe('htmlEncode', () => {
    before(() => {
      currSetterList.push('htmlEncode')
    })

    after(() => {
      currSetterList.length = 0
    })

    it('input is intact if no html entities present', () => {
      inputArr.push('testword')
      inputArr.forEach((elem) => {
        assert.strictEqual(setter.exec(elem, currSetterList), elem, 'failed for input => ' + elem)
      })
    })

    it('html entity is encoded', () => {
      inputArr.push('asds>e33')
      inputArr.forEach((elem) => {
        assert.notMatch(setter.exec(elem, currSetterList), />/g, 'failed for input => ' + elem)
      })
    })
  })

  describe('nameFormat', () => {
    before(() => {
      currSetterList.push('nameFormat')
    })

    after(() => {
      currSetterList.length = 0
    })

    it('sets wrong cased names correct - eg: eveLyN lOVe to Evelyn Love', () => {
      inputArr.push('john smith', 'JoHN sMItH', 'j. smiTh', 'smIth, joHn')
      let expectedOutputArr = ['John Smith', 'John Smith', 'J. Smith', 'Smith, John']
      inputArr.forEach((elem, index) => {
        assert.strictEqual(setter.exec(elem, currSetterList), expectedOutputArr[index], 'failed for input => ' + elem)
      })
    })
  })
})
