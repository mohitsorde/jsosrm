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
      let validatorArr = ['aplhabetical']
      let attrDef = attrDefgen(validatorArr, setterArr)
      let parsedObj = new ParserBaseClass(inputObj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.strictEqual(outputObj[attrName], setter.exec(inputObj[attrName], setterArr))
    })

    it('validator, setter and outKey =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['aplhabetical']
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
      let validatorArr = ['aplhabetical']
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
      let validatorArr = ['aplhabetical']
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
      let validatorArr = ['aplhabetical']
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
      let validatorArr = ['aplhabetical']
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
      let validatorArr = ['aplhabetical']
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
        attrDefgen(null, null, SubClass, outerAttr, false, 'myKey'),
        attrDefgen(validatorArr, setterArr, null, 'myKey', true)
      )
      let parsedObj = new ParserBaseClass(obj, false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.notExists(outputObj.errCode, 'no error found')
      assert.property(outputObj, 'myKey')
      assert.strictEqual(outputObj['myKey'][attrName], setter.exec(obj[outerAttr][attrName], setterArr))
    })

    it('parser, validator, setter, update and outKey  =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['aplhabetical']
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
  })

  describe('parser is array => ', () => {
    let setterArr = ['toLower']
    let validatorArr = ['aplhabetical']
    let outerAttr = 'outerAttr'

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
  })

  describe('parser fails =>', () => {
    it('validator and setter =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['aplhabetical']
      let attrDef = attrDefgen(validatorArr, setterArr)
      let parsedObj = new ParserBaseClass(Object.assign({}, inputObj, {
        [attrName]: '12213'
      }), false, false, attrDef)
      let outputObj = parsedObj.getParams()
      assert.exists(outputObj, 'errCode', 'expected error found')
      assert.strictEqual(outputObj.errParam, attrName)
      assert.strictEqual(outputObj.testKey, 'aplhabetical')
    })

    it('parser, validator and setter =>', () => {
      let setterArr = ['toLower']
      let validatorArr = ['aplhabetical']
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
  })

  describe('reverse the parsed object as per schema defined =>', () => {
    it('parser, custom validator,custom setter and custom getter =>', function () {
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
      let validatorArr = ['aplhabetical']
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
      let validatorArr = ['aplhabetical']
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
      }).catch(e => console.log(e))
    })
  })
})
