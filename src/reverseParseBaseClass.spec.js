'use strict'

const assert = require('chai').assert

const ReverseParseBaseClass = require('./ReverseParseBaseClass')
const GetterBaseClass = require('./GetterBaseClass')

const getter = new GetterBaseClass()

let attrName = 'testKey'
let attrVal = 'testVal'

let attrDefgen = (getterArr, parser, attrNameParam) => {
  let _attrName = attrNameParam || attrName
  let obj = getterArr ? {
    'getters': getterArr
  } : {
    'parser': parser
  }
  return {
    [ _attrName ]: obj
  }
}

let inputObj = {
  [ attrName ]: attrVal
}

describe('reverse parse input object as per schema defined =>', function () {
  it('simple getter =>', () => {
    let getterArr = ['asLower']
    let attrDef = attrDefgen(getterArr)
    let parsedObj = new ReverseParseBaseClass(inputObj, attrDef)
    let outputObj = parsedObj.getParams()
    assert.strictEqual(outputObj[attrName], getter.exec(inputObj[attrName], getterArr))
  })

  it('simple asynchronous getter =>', function (done) {
    this.timeout(3000)
    let getterArr = ['asLower', 'customAsyncGetter']
    let attrDef = attrDefgen(getterArr)
    let customGetter = new GetterBaseClass()
    customGetter.push('customAsyncGetter', function (val) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(val + '*')
        }, 200)
      })
    }, 'appends * at the end of val')
    let parsedObj = new ReverseParseBaseClass(inputObj, attrDef, customGetter, true)
    parsedObj.getParams().then((outputObj) => {
      try {
        assert.strictEqual(outputObj[attrName], getter.exec(inputObj[attrName], ['asLower']) + '*')
      } catch (e) {
        done(e)
      }
      done()
    })
  })
})
