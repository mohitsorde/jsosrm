'use strict'

const assert = require('chai').assert

const ParserBaseClass = require('./ParserBaseClass')
const SetterBaseClass = require('./SetterBaseClass')
const ValidatorBaseClass = require('./ValidatorBaseClass')
const GetterBaseClass = require('./GetterBaseClass')

const getter = new GetterBaseClass()
const setter = new SetterBaseClass()

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

    it('parser, custom validator and custom setter =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let outerAttr = 'outerAttr'

      function SubClass (params, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype._attrDefs = attrDefgen(validatorArr, setterArr)
      SubClass.prototype.validator = new ValidatorBaseClass()
      SubClass.prototype.validator.pushAll([{
        key: 'customValidator',
        desc: 'should have atleat one *',
        impl: function (val) {
          return /\*/.test(val)
        }
      }])
      SubClass.prototype.setter = new SetterBaseClass()
      SubClass.prototype.setter.pushAll([{
        key: 'customSetter',
        desc: 'remove *',
        impl: function (val) {
          return val.replace(/\*/g, '')
        }
      }])
      let obj = {
        [outerAttr]: Object.assign({}, inputObj, {
          [attrName]: 'rise*up'
        })
      }
      let attrDef = attrDefgen(null, null, SubClass, outerAttr)
      let parsedObj = new ParserBaseClass(obj, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][attrName], 'RISEUP')
    })
  })

  describe('parser is array => ', () => {
    let setterArr = ['toLower']
    let validatorArr = ['aplhabetical']
    let outerAttr = 'outerAttr'

    function SubClass (params, attrDefs) {
      ParserBaseClass.apply(this, arguments)
    }
    SubClass.prototype = Object.create(ParserBaseClass.prototype)
    SubClass.prototype.constructor = SubClass
    SubClass.prototype._attrDefs = attrDefgen(validatorArr, setterArr)

    let attrDef = attrDefgen(null, null, [SubClass], outerAttr)

    it('input is not array', () => {
      let obj = {
        [outerAttr]: inputObj
      }
      let parsedObj = new ParserBaseClass(obj, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][0][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
    })

    it('input is array', () => {
      let obj = {
        [outerAttr]: [inputObj]
      }
      let parsedObj = new ParserBaseClass(obj, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][0][attrName], setter.exec(obj[outerAttr][0][attrName], setterArr))
    })
  })

  describe('parser fails =>', () => {
    it('validator and setter =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['aplhabetical']
      let attrDef = attrDefgen(validatorArr, setterArr)
      let parsedObj = new ParserBaseClass(Object.assign({}, inputObj, {
        [attrName]: '12213'
      }), attrDef)
      let outputObj = parsedObj.getParams()
      assert.exists(outputObj, 'errCode', 'expected error found')
      assert.strictEqual(outputObj.errParam, attrName)
    })
  })

  describe('reverse the parsed object as per schema defined =>', () => {
    it('parser, custom validator,custom setter and custom getter =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let getterArr = ['asLower', 'appendAsterisk']
      let outerAttr = 'outerAttr'

      function SubClass (params, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype._attrDefs = attrDefgen(validatorArr, setterArr)
      SubClass.prototype._attrDefs[attrName]['getters'] = getterArr
      SubClass.prototype.validator = new ValidatorBaseClass()
      SubClass.prototype.validator.pushAll([{
        key: 'customValidator',
        desc: 'should have atleat one *',
        impl: function (val) {
          return /\*/.test(val)
        }
      }])
      SubClass.prototype.setter = new SetterBaseClass()
      SubClass.prototype.setter.pushAll([{
        key: 'customSetter',
        desc: 'remove *',
        impl: function (val) {
          return val.replace(/\*/g, '')
        }
      }])
      SubClass.prototype.getter = new GetterBaseClass()
      SubClass.prototype.getter.pushAll([{
        'key': 'appendAsterisk',
        'desc': 'appends asterisk at the end',
        'impl': function (val) {
          return val + '*'
        }
      }])
      let obj = {
        [outerAttr]: Object.assign({}, inputObj, {
          [attrName]: 'rise*up'
        })
      }
      let attrDef = attrDefgen(null, null, SubClass, outerAttr)
      let parsedObj = new ParserBaseClass(obj, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][attrName], 'RISEUP')
      outputObj = parsedObj.getReverseParams()
      assert.strictEqual(outputObj[outerAttr][attrName], getter.exec(SubClass.prototype.setter.exec(obj[outerAttr][attrName], ['customSetter']), ['asLower']) + '*')
    })
  })
})
