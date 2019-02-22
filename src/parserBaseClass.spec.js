'use strict'

const assert = require('chai').assert

const ParserBaseClass = require('./ParserBaseClass')
const SetterBaseClass = require('./SetterBaseClass')
// const ValidatorBaseClass = require('./ValidatorBaseClass')

const setter = new SetterBaseClass()
// const validator = new ValidatorBaseClass()

let attrName = 'testKey'
let attrVal = 'testVal'

let attrDefgen = (validatorArr, setterArr, parser, attrNameParam, optional) => {
  let _attrName = attrNameParam || attrName
  return {
    [ _attrName ]: {
      'validators': validatorArr,
      'setters': setterArr,
      'parser': parser,
      'optional': optional
    }
  }
}

let inputObj = {
  [ attrName ]: attrVal
}

describe('parse input object as per schema defined =>', () => {
  describe('parser passes =>', () => {
    it('only setter =>', () => {
      let setterArr = ['toLower']
      let attrDef = attrDefgen(null, setterArr)
      let parsedObj = new ParserBaseClass(inputObj, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[attrName], setter.exec(inputObj[attrName], setterArr))
    })

    it('validator and setter =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['aplhabetical']
      let attrDef = attrDefgen(validatorArr, setterArr)
      let parsedObj = new ParserBaseClass(inputObj, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[attrName], setter.exec(inputObj[attrName], setterArr))
    })

    it('parser, validator and setter =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['aplhabetical']
      let outerAttr = 'outerAttr'

      function SubClass (params, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype._attrDefs = attrDefgen(validatorArr, setterArr)
      let obj = {
        [outerAttr]: inputObj
      }
      let attrDef = attrDefgen(null, null, SubClass, outerAttr)
      let parsedObj = new ParserBaseClass(obj, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
    })
  })
})
