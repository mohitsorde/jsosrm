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

  it('getter with inner schema =>', () => {
    let getterArr = ['asLower']

    function SubClass (params, attrDefs) {
      ReverseParseBaseClass.apply(this, arguments)
    }

    SubClass.prototype = Object.create(ReverseParseBaseClass.prototype)
    SubClass.prototype.constructor = SubClass
    SubClass.prototype._attrDefs = attrDefgen(getterArr)

    let outerAttr = 'outerAttr'
    let obj = {
      [outerAttr]: inputObj
    }
    let attrDef = attrDefgen(null, SubClass, outerAttr)
    let parsedObj = new ReverseParseBaseClass(obj, attrDef)
    let outputObj = parsedObj.getParams()
    assert.strictEqual(outputObj[outerAttr][attrName], getter.exec(obj[outerAttr][attrName], getterArr))
  })

  it('customized getter with inner schema =>', () => {
    let getterArr = ['asLower', 'appendAsterisk']

    function SubClass (params, attrDefs) {
      ReverseParseBaseClass.apply(this, arguments)
    }

    SubClass.prototype = Object.create(ReverseParseBaseClass.prototype)
    SubClass.prototype.constructor = SubClass
    SubClass.prototype._attrDefs = attrDefgen(getterArr)
    SubClass.prototype.getter = new GetterBaseClass()
    SubClass.prototype.getter.pushAll([{
      'key': 'appendAsterisk',
      'desc': 'appends asterisk at the end',
      'impl': function (val) {
        return val + '*'
      }
    }])

    let outerAttr = 'outerAttr'
    let obj = {
      [outerAttr]: inputObj
    }
    let attrDef = attrDefgen(null, SubClass, outerAttr)
    let parsedObj = new ReverseParseBaseClass(obj, attrDef)
    let outputObj = parsedObj.getParams()
    assert.strictEqual(outputObj[outerAttr][attrName], getter.exec(obj[outerAttr][attrName], ['asLower']) + '*')
  })
})
