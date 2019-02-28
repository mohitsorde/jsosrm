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

describe('reverse parse input object as per schema defined =>', () => {
  it('simple getter =>', () => {
    let getterArr = ['asLower']
    let attrDef = attrDefgen(getterArr)
    let parsedObj = new ReverseParseBaseClass(inputObj, attrDef)
    let outputObj = parsedObj.getParams()
    assert.strictEqual(outputObj[attrName], getter.exec(inputObj[attrName], getterArr))
  })
})
