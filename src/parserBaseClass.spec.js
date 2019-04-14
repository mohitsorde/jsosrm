'use strict'

const assert = require('chai').assert

const ParserBaseClass = require('./ParserBaseClass')
const SetterBaseClass = require('./SetterBaseClass')
const ValidatorBaseClass = require('./ValidatorBaseClass')
const GetterBaseClass = require('./GetterBaseClass')

const getter = new GetterBaseClass()
const setter = new SetterBaseClass()

let attrName = 'utKey'
let attrVal = 'testVal'

let attrDefgen = (validatorArr, setterArr, parser, attrNameParam, optional, outKey, getterArr) => {
  let _attrName = attrNameParam || attrName
  return {
    [ _attrName ]: {
      'validators': validatorArr,
      'setters': setterArr,
      'parser': parser,
      'optional': optional,
      outKey,
      'getters': getterArr
    }
  }
}

let inputObj = {
  [ attrName ]: attrVal
}

// To Test - update, asyncHandle, deep validation key in object and in array, outKey, in README.md inheritance by extension

describe('parse input object as per schema defined =>', () => {
  describe('parser passes =>', () => {
    it('only setter =>', () => {
      let setterArr = ['toLower']
      let attrDef = attrDefgen(null, setterArr)
      let parsedObj = new ParserBaseClass(inputObj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[attrName], setter.exec(inputObj[attrName], setterArr))
    })

    it('validator and setter =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let attrDef = attrDefgen(validatorArr, setterArr)
      let parsedObj = new ParserBaseClass(inputObj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[attrName], setter.exec(inputObj[attrName], setterArr))
    })

    it('validator, setter and outKey =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let attrDef = attrDefgen(validatorArr, setterArr, null, null, false, 'myKey')
      let parsedObj = new ParserBaseClass(inputObj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.notProperty(outputObj, attrName)
      assert.property(outputObj, 'myKey')
      assert.strictEqual(outputObj['myKey'], setter.exec(inputObj[attrName], setterArr))
    })

    it('validator, setter and optional =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let attrDef = Object.assign(
        attrDefgen(validatorArr, setterArr),
        attrDefgen(validatorArr, setterArr, null, 'myKey', true)
      )
      let parsedObj = new ParserBaseClass(inputObj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.notProperty(outputObj, 'myKey')
      assert.property(outputObj, attrName)
      assert.strictEqual(outputObj[attrName], setter.exec(inputObj[attrName], setterArr))
    })

    it('validator, setter and update =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let attrDef = Object.assign(
        attrDefgen(validatorArr, setterArr),
        attrDefgen(validatorArr, setterArr, null, 'myKey')
      )
      let parsedObj = new ParserBaseClass(inputObj, true, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.notProperty(outputObj, 'myKey')
      assert.property(outputObj, attrName)
      assert.strictEqual(outputObj[attrName], setter.exec(inputObj[attrName], setterArr))
    })

    it('validator, setter, optional and outKey =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let attrDef = Object.assign(
        attrDefgen(validatorArr, setterArr, null, null, false, 'myKey'),
        attrDefgen(validatorArr, setterArr, null, 'myKey', true)
      )
      let parsedObj = new ParserBaseClass(inputObj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.property(outputObj, 'myKey')
      assert.strictEqual(outputObj['myKey'], setter.exec(inputObj[attrName], setterArr))
    })

    it('parser, validator and setter =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      let obj = {
        [outerAttr]: inputObj
      }
      let attrDef = attrDefgen(null, null, SubClass, outerAttr)
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
    })

    it('parser, validator, setter, optional and outKey  =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      let obj = {
        [outerAttr]: inputObj
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey2'),
        attrDefgen(validatorArr, setterArr, null, 'myKey', true)
      )
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.property(outputObj, 'myKey2')
      assert.strictEqual(outputObj['myKey2'][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
    })

    it('parser, validator, setter, update and outKey  =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      let obj = {
        [outerAttr]: inputObj
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey2'),
        attrDefgen(validatorArr, setterArr, null, 'myKey')
      )
      let parsedObj = new ParserBaseClass(obj, true, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.property(outputObj, 'myKey2')
      assert.strictEqual(outputObj['myKey2'][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
    })

    it('parser, custom validator and custom setter =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
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
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][attrName], 'RISEUP')
    })

    it('parser, errored async custom validator and custom setter =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      SubClass.prototype.validator = new ValidatorBaseClass()
      SubClass.prototype.validator.pushAll([{
        key: 'customValidator',
        desc: 'should have atleat one *',
        impl: function (val) {
          throw new Error({ err: 'err' })
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
      let parsedObj = new ParserBaseClass(obj, false, true, attrDef)
      return parsedObj.getParams().catch(e => {
        assert.property(e, 'testKey')
        assert.strictEqual(e['testKey'], 'RUNTIME_ERROR')
      })
    })
  })

  describe('parser is array => ', () => {
    let setterArr = ['toLower']
    let validatorArr = ['alphabetical']
    let outerAttr = 'outerAttr'
    let getterArr = ['asUpper']

    function SubClass (params, update, asyncHandle, attrDefs) {
      ParserBaseClass.apply(this, arguments)
    }
    SubClass.prototype = Object.create(ParserBaseClass.prototype)
    SubClass.prototype.constructor = SubClass
    SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)

    let attrDef = attrDefgen(null, null, [SubClass], outerAttr)

    it('input is not array', () => {
      let obj = {
        [outerAttr]: inputObj
      }
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][0][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
    })

    it('input is array', () => {
      let obj = {
        [outerAttr]: [inputObj]
      }
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][0][attrName], setter.exec(obj[outerAttr][0][attrName], setterArr))
    })

    it('input is deep array', () => {
      let obj = {
        [outerAttr]: [
          inputObj,
          [inputObj],
          [],
          [[[
            inputObj
          ]]]
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      let expectedVal = setter.exec(inputObj[attrName], setterArr)
      assert.property(outputObj, outerAttr)
      assert.isArray(outputObj[outerAttr])
      assert.lengthOf(outputObj[outerAttr], 4)
      assert.strictEqual(outputObj[outerAttr][0][attrName], expectedVal)
      assert.isArray(outputObj[outerAttr][1])
      assert.strictEqual(outputObj[outerAttr][1][0][attrName], expectedVal)
      assert.isArray(outputObj[outerAttr][2])
      assert.lengthOf(outputObj[outerAttr][2], 0)
      assert.isArray(outputObj[outerAttr][3])
      assert.strictEqual(outputObj[outerAttr][3][0][0][0][attrName], expectedVal)
      assert.notStrictEqual(obj[outerAttr][0][attrName], outputObj[outerAttr][0][attrName])
    })

    it('input is deep array and passes with async validation', () => {
      let obj = {
        [outerAttr]: [
          inputObj,
          [inputObj],
          [],
          [[[
            inputObj
          ]]]
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, true, attrDef)
      return parsedObj.getParams().then(outputObj => {
        assert.notExists(outputObj.errCode, 'no error found')
        let expectedVal = setter.exec(inputObj[attrName], setterArr)
        assert.property(outputObj, outerAttr)
        assert.isArray(outputObj[outerAttr])
        assert.lengthOf(outputObj[outerAttr], 4)
        assert.strictEqual(outputObj[outerAttr][0][attrName], expectedVal)
        assert.isArray(outputObj[outerAttr][1])
        assert.strictEqual(outputObj[outerAttr][1][0][attrName], expectedVal)
        assert.isArray(outputObj[outerAttr][2])
        assert.lengthOf(outputObj[outerAttr][2], 0)
        assert.isArray(outputObj[outerAttr][3])
        assert.strictEqual(outputObj[outerAttr][3][0][0][0][attrName], expectedVal)
        assert.notStrictEqual(obj[outerAttr][0][attrName], outputObj[outerAttr][0][attrName])
      })
    })

    it('input is array and parser fails', () => {
      let obj = {
        [outerAttr]: [
          inputObj,
          {
            [attrName]: 123
          }
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.property(outputObj, 'errCode')
      assert.property(outputObj, 'errParam')
      assert.property(outputObj, 'testKey')
      assert.strictEqual(outputObj['errParam'], outerAttr + '.1.' + attrName)
      assert.strictEqual(outputObj['testKey'], 'alphabetical')
    })

    it('input is deep array and parser fails', () => {
      let obj = {
        [outerAttr]: [
          inputObj,
          [inputObj],
          [],
          [[[
            {
              [attrName]: 1
            }
          ]]]
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.property(outputObj, 'errCode')
      assert.property(outputObj, 'errParam')
      assert.property(outputObj, 'testKey')
      assert.strictEqual(outputObj['errParam'], outerAttr + '.3.0.0.0.' + attrName)
      assert.strictEqual(outputObj['testKey'], 'alphabetical')
    })

    it('input is array and parser fails with async validation', () => {
      let obj = {
        [outerAttr]: [
          inputObj,
          {
            [attrName]: 123
          }
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, true, attrDef)
      return parsedObj.getParams().catch(outputObj => {
        assert.property(outputObj, 'errCode')
        assert.property(outputObj, 'errParam')
        assert.property(outputObj, 'testKey')
        assert.strictEqual(outputObj['errParam'], outerAttr + '.1.' + attrName)
        assert.strictEqual(outputObj['testKey'], 'alphabetical')
      })
    })

    it('input is deep array and parser fails with async validation', () => {
      let obj = {
        [outerAttr]: [
          inputObj,
          [inputObj],
          [],
          [[[
            { [attrName]: 1 }
          ]]]
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, true, attrDef)
      return parsedObj.getParams().catch(outputObj => {
        assert.property(outputObj, 'errCode')
        assert.property(outputObj, 'errParam')
        assert.property(outputObj, 'testKey')
        assert.strictEqual(outputObj['errParam'], outerAttr + '.3.0.0.0.' + attrName)
        assert.strictEqual(outputObj['testKey'], 'alphabetical')
      })
    })

    it('input is array of atomic values and parser fails', () => {
      let obj = {
        [outerAttr]: [
          inputObj[attrName],
          123
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, false, {
        [outerAttr]: [attrDefgen(validatorArr, setterArr)[attrName]]
      })
      let outputObj = parsedObj.getParams()
      assert.property(outputObj, 'errCode')
      assert.property(outputObj, 'errParam')
      assert.property(outputObj, 'testKey')
      assert.strictEqual(outputObj['errParam'], outerAttr + '.1')
      assert.strictEqual(outputObj['testKey'], 'alphabetical')
    })

    it('input is deep array of atomic values and parser fails', () => {
      let obj = {
        [outerAttr]: [
          inputObj[attrName],
          [inputObj[attrName]],
          [],
          [[[inputObj[attrName], 1]]]
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, false, {
        [outerAttr]: [attrDefgen(validatorArr, setterArr)[attrName]]
      })
      let outputObj = parsedObj.getParams()
      assert.property(outputObj, 'errCode')
      assert.property(outputObj, 'errParam')
      assert.property(outputObj, 'testKey')
      assert.strictEqual(outputObj['errParam'], outerAttr + '.3.0.0.1')
      assert.strictEqual(outputObj['testKey'], 'alphabetical')
    })

    it('input is array of atomic values and parser fails with async', () => {
      let obj = {
        [outerAttr]: [
          inputObj[attrName],
          123
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, true, {
        [outerAttr]: [attrDefgen(validatorArr, setterArr)[attrName]]
      })
      return parsedObj.getParams().catch(outputObj => {
        assert.property(outputObj, 'errCode')
        assert.property(outputObj, 'errParam')
        assert.property(outputObj, 'testKey')
        assert.strictEqual(outputObj['errParam'], outerAttr + '.1')
        assert.strictEqual(outputObj['testKey'], 'alphabetical')
      })
    })

    it('input is array of atomic values and parser passes', () => {
      let obj = {
        [outerAttr]: [
          inputObj[attrName],
          'sdfsdf'
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, false, {
        [outerAttr]: [attrDefgen(validatorArr, setterArr, null, null, null, null, getterArr)[attrName]]
      })
      let outputObj = parsedObj.getParams()
      assert.notProperty(outputObj, 'errCode')
      assert.property(outputObj, outerAttr)
      assert.isArray(outputObj[outerAttr])
      assert.notStrictEqual(outputObj[outerAttr].length, 0)
      assert.strictEqual(outputObj[outerAttr][0], setter.exec(obj[outerAttr][0], setterArr))
      outputObj = parsedObj.getReverseParams()
      assert.strictEqual(outputObj[outerAttr][0], getter.exec(obj[outerAttr][0], getterArr))
    })

    it('input is deep array of atomic values and parser passes', () => {
      let obj = {
        [outerAttr]: [
          inputObj[attrName],
          [inputObj[attrName]],
          [],
          [[[inputObj[attrName]]]]
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, false, {
        [outerAttr]: [attrDefgen(validatorArr, setterArr, null, null, null, 'myKey', getterArr)[attrName]]
      })
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      let expectedVal = setter.exec(inputObj[attrName], setterArr)
      outerAttr = 'myKey'
      assert.property(outputObj, outerAttr)
      assert.isArray(outputObj[outerAttr])
      assert.lengthOf(outputObj[outerAttr], 4)
      assert.strictEqual(outputObj[outerAttr][0], expectedVal)
      assert.isArray(outputObj[outerAttr][1])
      assert.strictEqual(outputObj[outerAttr][1][0], expectedVal)
      assert.isArray(outputObj[outerAttr][2])
      assert.lengthOf(outputObj[outerAttr][2], 0)
      assert.isArray(outputObj[outerAttr][3])
      assert.strictEqual(outputObj[outerAttr][3][0][0][0], expectedVal)
    })

    it('input is deep array of atomic values and parser passes with async validation', () => {
      let obj = {
        [outerAttr]: [
          inputObj[attrName],
          [inputObj[attrName]],
          [],
          [[[inputObj[attrName]]]]
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, true, {
        [outerAttr]: [attrDefgen(validatorArr, setterArr, null, null, null, null, getterArr)[attrName]]
      })
      return parsedObj.getParams().then(outputObj => {
        assert.notExists(outputObj.errCode, 'no error found')
        let expectedVal = setter.exec(inputObj[attrName], setterArr)
        assert.property(outputObj, outerAttr)
        assert.isArray(outputObj[outerAttr])
        assert.lengthOf(outputObj[outerAttr], 4)
        assert.strictEqual(outputObj[outerAttr][0], expectedVal)
        assert.isArray(outputObj[outerAttr][1])
        assert.strictEqual(outputObj[outerAttr][1][0], expectedVal)
        assert.isArray(outputObj[outerAttr][2])
        assert.lengthOf(outputObj[outerAttr][2], 0)
        assert.isArray(outputObj[outerAttr][3])
        assert.strictEqual(outputObj[outerAttr][3][0][0][0], expectedVal)
      })
    })

    it('input is array of atomic values and parser passes with async', () => {
      let obj = {
        [outerAttr]: [
          inputObj[attrName],
          'sdfsdf'
        ]
      }
      let parsedObj = new ParserBaseClass(obj, false, true, {
        [outerAttr]: [attrDefgen(validatorArr, setterArr, null, null, null, null, getterArr)[attrName]]
      })
      return parsedObj.getParams().then(outputObj => {
        assert.notProperty(outputObj, 'errCode')
        assert.property(outputObj, outerAttr)
        assert.isArray(outputObj[outerAttr])
        assert.notStrictEqual(outputObj[outerAttr].length, 0)
        assert.strictEqual(outputObj[outerAttr][0], setter.exec(obj[outerAttr][0], setterArr))
        return parsedObj.getReverseParams()
      }).then(outputObj => assert.strictEqual(outputObj[outerAttr][0], getter.exec(obj[outerAttr][0], getterArr)))
    })
  })

  describe('parser fails =>', () => {
    it('validator and setter =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let attrDef = attrDefgen(validatorArr, setterArr)
      let parsedObj = new ParserBaseClass(Object.assign({}, inputObj, {
        [attrName]: '12213'
      }), false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.exists(outputObj, 'errCode', 'expected error found')
      assert.strictEqual(outputObj.errParam, attrName)
      assert.strictEqual(outputObj.testKey, 'alphabetical')
    })

    it('parser, validator and setter =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      let obj = {
        [outerAttr]: inputObj
      }
      let attrDef = attrDefgen(null, null, SubClass, outerAttr)
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
    })

    it('parser, validator, setter, optional and outKey  =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      let obj = {
        [outerAttr]: Object.assign({
          'myKey': inputObj[attrName]
        }, inputObj, {
          [attrName]: 12
        })
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey2'),
        attrDefgen(validatorArr, setterArr, null, 'myKey', true)
      )
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.property(outputObj, 'errCode')
      assert.property(outputObj, 'errParam')
      assert.property(outputObj, 'testKey')
      assert.strictEqual(outputObj['errParam'], outerAttr + '.' + attrName)
      assert.strictEqual(outputObj.testKey, 'alphabetical')
    })

    it('parser, validator, setter, update and outKey  =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      let obj = {
        [outerAttr]: Object.assign({
          'myKey': inputObj[attrName]
        }, inputObj, {
          [attrName]: 12
        })
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey2'),
        attrDefgen(validatorArr, setterArr, null, 'myKey')
      )
      let parsedObj = new ParserBaseClass(obj, true, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.property(outputObj, 'errCode')
      assert.property(outputObj, 'errParam')
      assert.property(outputObj, 'testKey')
      assert.strictEqual(outputObj['errParam'], outerAttr + '.' + attrName)
      assert.strictEqual(outputObj.testKey, 'alphabetical')
    })

    it('parser, custom async validator, custom async setter, optional, explicit outKey and custom async getter =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let getterArr = ['asLower', 'appendAsterisk']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      SubClass.prototype.attrDefs[attrName]['getters'] = getterArr
      SubClass.prototype.validator = new ValidatorBaseClass()
      SubClass.prototype.validator.pushAll([{
        key: 'customValidator',
        desc: 'should have atleat one *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(/\*/.test(val))
          })
        }
      }])
      SubClass.prototype.setter = new SetterBaseClass()
      SubClass.prototype.setter.pushAll([{
        key: 'customSetter',
        desc: 'remove *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(val.replace(/\*/g, ''))
          })
        }
      }])
      SubClass.prototype.getter = new GetterBaseClass()
      SubClass.prototype.getter.pushAll([{
        'key': 'appendAsterisk',
        'desc': 'appends asterisk at the end',
        'impl': function (val) {
          return new Promise((resolve, reject) => {
            resolve(val + '*')
          })
        }
      }])
      let obj = {
        [outerAttr]: Object.assign({}, inputObj, {
          [attrName]: 'riseup'
        }),
        'myKey2': 'riseup'
      }
      let attrDef = Object.assign(
        attrDefgen(['alphabetical'], ['toUpper'], null, 'myKey2', true, null, ['asLower']),
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey')
      )
      let parsedObj = new ParserBaseClass(obj, false, true, attrDef)
      return parsedObj.getParams().catch((outputObj) => {
        assert.property(outputObj, 'errCode')
        assert.property(outputObj, 'errParam')
        assert.property(outputObj, 'testKey')
        assert.strictEqual(outputObj['errParam'], outerAttr + '.' + attrName)
        assert.strictEqual(outputObj.testKey, 'customValidator')
      })
    })

    it('parser, custom async validator, custom async setter, update, explicit outKey and custom async getter =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let getterArr = ['asLower', 'appendAsterisk']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      SubClass.prototype.attrDefs[attrName]['getters'] = getterArr
      SubClass.prototype.validator = new ValidatorBaseClass()
      SubClass.prototype.validator.pushAll([{
        key: 'customValidator',
        desc: 'should have atleat one *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(/\*/.test(val))
          })
        }
      }])
      SubClass.prototype.setter = new SetterBaseClass()
      SubClass.prototype.setter.pushAll([{
        key: 'customSetter',
        desc: 'remove *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(val.replace(/\*/g, ''))
          })
        }
      }])
      SubClass.prototype.getter = new GetterBaseClass()
      SubClass.prototype.getter.pushAll([{
        'key': 'appendAsterisk',
        'desc': 'appends asterisk at the end',
        'impl': function (val) {
          return new Promise((resolve, reject) => {
            resolve(val + '*')
          })
        }
      }])
      let obj = {
        [outerAttr]: Object.assign({}, inputObj, {
          [attrName]: 'riseup'
        }),
        'myKey2': 'riseup'
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey'),
        attrDefgen(['alphabetical'], ['toUpper'], null, 'myKey2', true, null, ['asLower'])
      )

      function BaseClass (params, update, asyncHandle) {
        ParserBaseClass.apply(this, arguments)
      }

      BaseClass.prototype = Object.create(ParserBaseClass.prototype)
      BaseClass.prototype.constructor = BaseClass
      BaseClass.prototype.attrDefs = attrDef

      let parsedObj = new BaseClass(obj, true, true)
      return parsedObj.getParams().catch((outputObj) => {
        assert.property(outputObj, 'errCode')
        assert.property(outputObj, 'errParam')
        assert.property(outputObj, 'testKey')
        assert.strictEqual(outputObj['errParam'], outerAttr + '.' + attrName)
        assert.strictEqual(outputObj.testKey, 'customValidator')
      })
    })
  })

  describe('reverse the parsed object as per schema defined =>', () => {
    it('parser, custom validator, custom setter and custom getter =>', function () {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let getterArr = ['asLower', 'appendAsterisk']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      SubClass.prototype.attrDefs[attrName]['getters'] = getterArr
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
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[outerAttr][attrName], 'RISEUP')
      outputObj = parsedObj.getReverseParams()
      assert.strictEqual(outputObj[outerAttr][attrName], getter.exec(SubClass.prototype.setter.exec(obj[outerAttr][attrName], ['customSetter']), ['asLower']) + '*')
      outputObj = (new ParserBaseClass(null, false, false, attrDef)).getReverseParams(parsedObj.getParams())
      assert.strictEqual(outputObj[outerAttr][attrName], getter.exec(SubClass.prototype.setter.exec(obj[outerAttr][attrName], ['customSetter']), ['asLower']) + '*')
    })

    it('parser, validator, setter, optional, outKey and getter  =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let outerAttr = 'outerAttr'
      let getterArr = ['asUpper']

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr, null, null, false, null, getterArr)
      let obj = {
        [outerAttr]: inputObj
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey')
      )
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.property(outputObj, 'myKey')
      assert.strictEqual(outputObj['myKey'][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
      outputObj = parsedObj.getReverseParams()
      assert.strictEqual(outputObj['myKey'][attrName], getter.exec(obj[outerAttr][attrName], ['asUpper']))
      outputObj = (new ParserBaseClass(null, false, false, attrDef)).getReverseParams(parsedObj.getParams())
      assert.strictEqual(outputObj['myKey'][attrName], getter.exec(obj[outerAttr][attrName], ['asUpper']))
    })

    it('parser, validator, setter, optional, explicit outKey and getter  =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['alphabetical']
      let outerAttr = 'outerAttr'
      let getterArr = ['asUpper']

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr, null, null, false, null, getterArr)
      let obj = {
        [outerAttr]: inputObj
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey'),
        attrDefgen(validatorArr, setterArr, null, 'myKey2', true, null, getterArr)
      )
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.notProperty(outputObj, 'myKey2')
      assert.property(outputObj, 'myKey')
      assert.strictEqual(outputObj['myKey'][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
      outputObj = parsedObj.getReverseParams()
      assert.notProperty(outputObj, 'myKey2')
      assert.strictEqual(outputObj['myKey'][attrName], getter.exec(obj[outerAttr][attrName], ['asUpper']))
      outputObj = (new ParserBaseClass(null, false, false, attrDef)).getReverseParams(parsedObj.getParams())
      assert.notProperty(outputObj, 'myKey2')
      assert.strictEqual(outputObj['myKey'][attrName], getter.exec(obj[outerAttr][attrName], ['asUpper']))
    })

    it('parser, custom async validator, custom async setter, optional, explicit outKey and custom async getter =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let getterArr = ['asLower', 'appendAsterisk']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      SubClass.prototype.attrDefs[attrName]['getters'] = getterArr
      SubClass.prototype.validator = new ValidatorBaseClass()
      SubClass.prototype.validator.pushAll([{
        key: 'customValidator',
        desc: 'should have atleat one *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(/\*/.test(val))
          })
        }
      }])
      SubClass.prototype.setter = new SetterBaseClass()
      SubClass.prototype.setter.pushAll([{
        key: 'customSetter',
        desc: 'remove *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(val.replace(/\*/g, ''))
          })
        }
      }])
      SubClass.prototype.getter = new GetterBaseClass()
      SubClass.prototype.getter.pushAll([{
        'key': 'appendAsterisk',
        'desc': 'appends asterisk at the end',
        'impl': function (val) {
          return new Promise((resolve, reject) => {
            resolve(val + '*')
          })
        }
      }])
      let obj = {
        [outerAttr]: Object.assign({}, inputObj, {
          [attrName]: 'rise*up'
        })
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey'),
        attrDefgen(validatorArr, setterArr, null, 'myKey2', true, null, getterArr)
      )
      let parsedObj = new ParserBaseClass(obj, false, true, attrDef)
      return parsedObj.getParams().then((outputObj) => {
        assert.notExists(outputObj.errCode, 'no error found')
        assert.notProperty(outputObj, 'myKey2')
        assert.property(outputObj, 'myKey')
        assert.strictEqual(outputObj['myKey'][attrName], 'RISEUP')
        return parsedObj.getReverseParams().then((outputObj2) => {
          assert.notProperty(outputObj2, 'myKey2')
          assert.strictEqual(outputObj2['myKey'][attrName], getter.exec(SubClass.prototype.setter.exec(obj[outerAttr][attrName].replace(/\*/g, '')), ['asLower']) + '*')
          return (new ParserBaseClass(null, false, true, attrDef)).getReverseParams(outputObj, true)
            .then((outputObj2) => {
              assert.notProperty(outputObj2, 'myKey2')
              assert.strictEqual(outputObj2['myKey'][attrName], getter.exec(SubClass.prototype.setter.exec(obj[outerAttr][attrName].replace(/\*/g, '')), ['asLower']) + '*')
            })
        })
      })
    })

    it('parser, custom async validator, custom async setter, update, explicit outKey and custom async getter =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let getterArr = ['asLower', 'appendAsterisk']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      SubClass.prototype.attrDefs[attrName]['getters'] = getterArr
      SubClass.prototype.validator = new ValidatorBaseClass()
      SubClass.prototype.validator.pushAll([{
        key: 'customValidator',
        desc: 'should have atleat one *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(/\*/.test(val))
          })
        }
      }])
      SubClass.prototype.setter = new SetterBaseClass()
      SubClass.prototype.setter.pushAll([{
        key: 'customSetter',
        desc: 'remove *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(val.replace(/\*/g, ''))
          })
        }
      }])
      SubClass.prototype.getter = new GetterBaseClass()
      SubClass.prototype.getter.pushAll([{
        'key': 'appendAsterisk',
        'desc': 'appends asterisk at the end',
        'impl': function (val) {
          return new Promise((resolve, reject) => {
            resolve(val + '*')
          })
        }
      }])
      let obj = {
        [outerAttr]: Object.assign({}, inputObj, {
          [attrName]: 'rise*up'
        })
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey'),
        attrDefgen(validatorArr, setterArr, null, 'myKey2', true, null, getterArr)
      )

      function BaseClass (params, update, asyncHandle) {
        ParserBaseClass.apply(this, arguments)
      }

      BaseClass.prototype = Object.create(ParserBaseClass.prototype)
      BaseClass.prototype.constructor = BaseClass
      BaseClass.prototype.attrDefs = attrDef

      let parsedObj = new BaseClass(obj, true, true)
      return parsedObj.getParams().then((outputObj) => {
        assert.notExists(outputObj.errCode, 'no error found')
        assert.notProperty(outputObj, 'myKey2')
        assert.property(outputObj, 'myKey')
        assert.strictEqual(outputObj['myKey'][attrName], 'RISEUP')
        return parsedObj.getReverseParams().then((outputObj2) => {
          assert.notProperty(outputObj2, 'myKey2')
          assert.strictEqual(outputObj2['myKey'][attrName], getter.exec(SubClass.prototype.setter.exec(obj[outerAttr][attrName].replace(/\*/g, '')), ['asLower']) + '*')
          return (new BaseClass(null)).getReverseParams(outputObj, true)
            .then((outputObj2) => {
              assert.notProperty(outputObj2, 'myKey2')
              assert.strictEqual(outputObj2['myKey'][attrName], getter.exec(SubClass.prototype.setter.exec(obj[outerAttr][attrName].replace(/\*/g, '')), ['asLower']) + '*')
            })
        })
      })
    })

    it('parser, custom async validator, custom async setter, explicit outKey and custom async getter with deep array =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let getterArr = ['asLower', 'appendAsterisk']
      let outerAttr = 'outerAttr'

      function SubClass (params, update, asyncHandle, attrDefs) {
        ParserBaseClass.apply(this, arguments)
      }

      SubClass.prototype = Object.create(ParserBaseClass.prototype)
      SubClass.prototype.constructor = SubClass
      SubClass.prototype.attrDefs = attrDefgen(validatorArr, setterArr)
      SubClass.prototype.attrDefs[attrName]['getters'] = getterArr
      SubClass.prototype.validator = new ValidatorBaseClass()
      SubClass.prototype.validator.pushAll([{
        key: 'customValidator',
        desc: 'should have atleat one *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(/\*/.test(val))
          })
        }
      }])
      SubClass.prototype.setter = new SetterBaseClass()
      SubClass.prototype.setter.pushAll([{
        key: 'customSetter',
        desc: 'remove *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(val.replace(/\*/g, ''))
          })
        }
      }])
      SubClass.prototype.getter = new GetterBaseClass()
      SubClass.prototype.getter.pushAll([{
        'key': 'appendAsterisk',
        'desc': 'appends asterisk at the end',
        'impl': function (val) {
          return new Promise((resolve, reject) => {
            resolve(val + '*')
          })
        }
      }])
      let newInputObj = Object.assign({}, inputObj, {
        [attrName]: 'rise*up'
      })
      let obj = {
        [outerAttr]: [
          newInputObj,
          [newInputObj],
          [],
          [[[newInputObj]]]
        ]
      }
      let attrDef = Object.assign(
        attrDefgen(null, null, [SubClass], outerAttr, false, 'myKey')
      )

      function BaseClass (params, update, asyncHandle) {
        ParserBaseClass.apply(this, arguments)
      }

      BaseClass.prototype = Object.create(ParserBaseClass.prototype)
      BaseClass.prototype.constructor = BaseClass
      BaseClass.prototype.attrDefs = attrDef

      let parsedObj = new BaseClass(obj, false, true)
      let expectedVal = getter.exec(SubClass.prototype.setter.exec(newInputObj[attrName].replace(/\*/g, '')), ['asLower']) + '*'
      return parsedObj.getParams().then((outputObj2) => {
        let outerAttr = 'myKey'
        assert.notExists(outputObj2.errCode, 'no error found')
        return parsedObj.getReverseParams().then((outputObj) => {
          assert.property(outputObj, outerAttr)
          assert.isArray(outputObj[outerAttr])
          assert.lengthOf(outputObj[outerAttr], 4)
          assert.strictEqual(outputObj[outerAttr][0][attrName], expectedVal)
          assert.isArray(outputObj[outerAttr][1])
          assert.strictEqual(outputObj[outerAttr][1][0][attrName], expectedVal)
          assert.isArray(outputObj[outerAttr][2])
          assert.lengthOf(outputObj[outerAttr][2], 0)
          assert.isArray(outputObj[outerAttr][3])
          assert.strictEqual(outputObj[outerAttr][3][0][0][0][attrName], expectedVal)
          assert.notStrictEqual(obj[Object.keys(obj)[0]][0][attrName], outputObj[outerAttr][0][attrName])
          return (new BaseClass(null)).getReverseParams(outputObj2, true)
            .then((outputObj) => {
              assert.property(outputObj, outerAttr)
              assert.isArray(outputObj[outerAttr])
              assert.lengthOf(outputObj[outerAttr], 4)
              assert.strictEqual(outputObj[outerAttr][0][attrName], expectedVal)
              assert.isArray(outputObj[outerAttr][1])
              assert.strictEqual(outputObj[outerAttr][1][0][attrName], expectedVal)
              assert.isArray(outputObj[outerAttr][2])
              assert.lengthOf(outputObj[outerAttr][2], 0)
              assert.isArray(outputObj[outerAttr][3])
              assert.strictEqual(outputObj[outerAttr][3][0][0][0][attrName], expectedVal)
              assert.notStrictEqual(obj[Object.keys(obj)[0]][0][attrName], outputObj[outerAttr][0][attrName])
            })
        })
      })
    })

    it('parser, custom async validator, custom async setter, explicit outKey, atomic values and custom async getter with deep array =>', () => {
      let setterArr = ['customSetter', 'toUpper']
      let validatorArr = ['customValidator']
      let getterArr = ['asLower', 'appendAsterisk']
      let outerAttr = 'outerAttr'

      let newInputObj = 'rise*up'
      let obj = {
        [outerAttr]: [
          newInputObj,
          [newInputObj],
          [],
          [[[newInputObj]]]
        ]
      }

      function BaseClass (params, update, asyncHandle) {
        ParserBaseClass.apply(this, arguments)
      }

      BaseClass.prototype = Object.create(ParserBaseClass.prototype)
      BaseClass.prototype.constructor = BaseClass
      BaseClass.prototype.attrDefs = {
        [outerAttr]: [attrDefgen(
          validatorArr,
          setterArr,
          null,
          null,
          false,
          'myKey',
          getterArr
        )[attrName]]
      }
      BaseClass.prototype.validator = new ValidatorBaseClass()
      BaseClass.prototype.validator.pushAll([{
        key: 'customValidator',
        desc: 'should have atleat one *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(/\*/.test(val))
          })
        }
      }])
      BaseClass.prototype.setter = new SetterBaseClass()
      BaseClass.prototype.setter.pushAll([{
        key: 'customSetter',
        desc: 'remove *',
        impl: function (val) {
          return new Promise((resolve, reject) => {
            resolve(val.replace(/\*/g, ''))
          })
        }
      }])
      BaseClass.prototype.getter = new GetterBaseClass()
      BaseClass.prototype.getter.pushAll([{
        'key': 'appendAsterisk',
        'desc': 'appends asterisk at the end',
        'impl': function (val) {
          return new Promise((resolve, reject) => {
            resolve(val + '*')
          })
        }
      }])

      let parsedObj = new BaseClass(obj, false, true)
      let expectedVal = getter.exec(BaseClass.prototype.setter.exec(newInputObj.replace(/\*/g, '')), ['asLower']) + '*'
      return parsedObj.getParams().then((outputObj2) => {
        let outerAttr = 'myKey'
        assert.notExists(outputObj2.errCode, 'no error found')
        return parsedObj.getReverseParams().then((outputObj) => {
          assert.property(outputObj, outerAttr)
          assert.isArray(outputObj[outerAttr])
          assert.lengthOf(outputObj[outerAttr], 4)
          assert.strictEqual(outputObj[outerAttr][0], expectedVal)
          assert.isArray(outputObj[outerAttr][1])
          assert.strictEqual(outputObj[outerAttr][1][0], expectedVal)
          assert.isArray(outputObj[outerAttr][2])
          assert.lengthOf(outputObj[outerAttr][2], 0)
          assert.isArray(outputObj[outerAttr][3])
          assert.strictEqual(outputObj[outerAttr][3][0][0][0], expectedVal)
          assert.notStrictEqual(obj[Object.keys(obj)[0]][0], outputObj[outerAttr][0])
          return (new BaseClass(null)).getReverseParams(outputObj2, true)
            .then((outputObj) => {
              assert.property(outputObj, outerAttr)
              assert.isArray(outputObj[outerAttr])
              assert.lengthOf(outputObj[outerAttr], 4)
              assert.strictEqual(outputObj[outerAttr][0], expectedVal)
              assert.isArray(outputObj[outerAttr][1])
              assert.strictEqual(outputObj[outerAttr][1][0], expectedVal)
              assert.isArray(outputObj[outerAttr][2])
              assert.lengthOf(outputObj[outerAttr][2], 0)
              assert.isArray(outputObj[outerAttr][3])
              assert.strictEqual(outputObj[outerAttr][3][0][0][0], expectedVal)
              assert.notStrictEqual(obj[Object.keys(obj)[0]][0], outputObj[outerAttr][0])
            })
        })
      })
    })
  })
})
