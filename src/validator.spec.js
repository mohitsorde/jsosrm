'use strict'

const assert = require('chai').assert

const ValidatorBaseClass = require('./ValidatorBaseClass')

describe('validators => ', () => {
  let currValidationList = []
  let inputArr = []
  let validator = new ValidatorBaseClass()

  beforeEach(() => {
    inputArr.length = 0
  })

  describe('aplhabetical', () => {
    before(() => {
      currValidationList.push('aplhabetical')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if the input is pure string, irrespective of case sensitivity', () => {
      inputArr.push('testword', 'testWord', 'TESTWORD')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is type other than string or is string containing non alphabetical characters', () => {
      inputArr.push(false, 123, {}, [], undefined, null, '', 'sds0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('alphaNumeric', () => {
    before(() => {
      currValidationList.push('alphaNumeric')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if the input is a string with aplhunumeric characters only', () => {
      inputArr.push('sfwefwefweffe', '2342342315464', 'q34q34324')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input includes characters other than alphanumeric', () => {
      inputArr.push('dfh3298uu 29340', 'sdjirr*sdwe', 99, {}, [])
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('nameOnly', () => {
    before(() => {
      currValidationList.push('nameOnly')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if the input conforms to naming convention', () => {
      inputArr.push('Mr. Smith', 'the one', 'A. D. Julia', 'Bond, James', 'l')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input doesn\'t conform to naming convention', () => {
      inputArr.push('@neo', 'mi*shkov ach', 'ero 99 ero', 99, {}, [])
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('emailId', () => {
    before(() => {
      currValidationList.push('emailId')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if the input is a valid email id', () => {
      inputArr.push(
        'prettyandsimple@example.com', // variations taken from wiki
        'very.common@example.com.in',
        'disposable.style.email.with+symbol@example.com',
        'other.email-with-dash@example.com',
        'fully-qualified-domain@example.com',
        'user.name+tag+sorting@example.com', // will go to user.name@example.com inbox
        'x@example.com', // one-letter local-part
        // '"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com',
        'example-indeed@strange-example.com',
        '1234567890123456789012345678901234567890123456789012345678901234+x@example.com' // **************(too long)
        // "admin@mailserver1",
        // "#!$%&'*+-/=?^_`{}|~@example.org",
        // '"' + '()<>[]:,;@\\\"!#$%&' + "'-/=?^_`{}| ~.a" + '"@example.org',
        // "example@s.solutions", //currently we are not allowing domain
        // "user@localserver",
        // "user@[2001:DB8::1]"
      )
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input breaks the standard email id format', () => {
      inputArr.push(
        'Abc.example.com', // (no @ character)
        'A@b@c@example.com', // (only one @ is allowed outside quotation marks)
        'a"b(c)d,e:f;g<h>i[j\\k]l@example.com', // (none of the special characters in this local-part are allowed outside quotation marks)
        'just"not"right@example.com', // (quoted strings must be dot separated or the only element making up the local-part)
        'this is"not\\allowed@example.com', // (spaces, quotes, and backslashes may only exist when within quoted strings and preceded by a backslash)
        'this\\ still\\"not\\allowed@example.com', // (even if escaped (preceded by a backslash), spaces, quotes, and backslashes must still be contained by quotes)
        'john..doe@example.com', // (double dot before @)
        'example@localhost', // (sent from localhost) with caveat: Gmail lets this through, Email address#Local-part the dots altogether
        'john.doe@example..com', // (double dot after @)
        '" "@example.org', // (space between the quotes)
        '"very.unusual.@.unusual.com"@example.com', //* *******************RFC allows this by the way */
        'Duy', //
        ' very.common@example.com.in',
        'very.common@example.com.in ',
        ''
      )
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('naturalNumber', () => {
    before(() => {
      currValidationList.push('naturalNumber')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if the input is a natural number', () => {
      inputArr.push(112, 9)
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is anything other than a natural number', () => {
      inputArr.push(false, 123.01, 0, -3, -8.3, {}, [], undefined, null, '', 'sds0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('integerOnly', () => {
    before(() => {
      currValidationList.push('integerOnly')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if the input is an integer', () => {
      inputArr.push(-112, 9, 0)
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is anything other than an integer', () => {
      inputArr.push(false, 123.01, -8.3, {}, [], undefined, null, '', 'sds0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('floatingNumber', () => {
    before(() => {
      currValidationList.push('floatingNumber')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if the input is a decimal', () => {
      inputArr.push(-112, 9, 0, 0.002, -1.232)
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is anything other than a decimal', () => {
      inputArr.push(false, {}, [], undefined, null, '', 'sds0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('addressOnly', () => {
    before(() => {
      currValidationList.push('addressOnly')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if the input is a valid address format', () => {
      inputArr.push(
        'NY',
        'A112',
        'B-wing, San Fransisco, CA00123',
        'K3, Lane No. 04, Chennai (38392)'
      )
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is not a valid address', () => {
      inputArr.push(false, {}, [], undefined, null, '', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('isBoolean', () => {
    before(() => {
      currValidationList.push('isBoolean')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if the input is of type boolean', () => {
      inputArr.push(true, false)
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is anything other than a decimal', () => {
      inputArr.push(1, 0, {}, [], undefined, null, '', "sd<script src=''></script>", 'True', 'False')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('phoneNumber', () => {
    before(() => {
      currValidationList.push('phoneNumber')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if valid phone number characters are provided', () => {
      inputArr.push('+91393949323', '(020) 999 - 329439')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if valid phone number characters are not provided', () => {
      inputArr.push({}, [], '*39439', 'q230230', undefined, null, '', "sd<script src=''></script>", 'True', 'False')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('max number of allowed characters', () => {
    before(() => {
      currValidationList.push('maxChar_3')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if number of input characters does not exceed the upper limit', () => {
      inputArr.push('*', '8d#', 'l+', '0.0')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if number of input characters exceed the upper limit', () => {
      inputArr.push('*39439', '23.0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('min number of expected characters', () => {
    before(() => {
      currValidationList.push('minChar_3')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if number of input characters does not exceed the upper limit', () => {
      inputArr.push('8d#', '0.0', '23.0')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if number of input characters exceed the upper limit', () => {
      inputArr.push('l+', '*', '')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('adding custom validator', () => {
    let validator = new ValidatorBaseClass()
    validator.pushAll([{
      'key': 'alwaysTrue',
      'impl': function (val) { return true },
      'desc': 'always returns true for any input'
    }])
    before(() => {
      currValidationList.push('alwaysTrue')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if number of input characters does not exceed the upper limit', () => {
      inputArr.push(false, 123, {}, [], undefined, null, '', 'sds0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })
  })

  describe('override existing validator', () => {
    let validator = new ValidatorBaseClass()
    validator.pushAll([{
      'key': 'aplhabetical',
      'impl': function (val) { return true },
      'desc': 'always returns true for any input'
    }])
    before(() => {
      currValidationList.push('aplhabetical', 'maxChar_3')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true if number of input characters does not exceed the upper limit irrespective of the characters not being strictly alphabetical', () => {
      inputArr.push('aaa', '802', '*r', '')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if number of input characters exceed the upper limit even if the characters are strictly alphabetical', () => {
      inputArr.push('aaar', 'AWQWEW')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, false, 'failed for input => ' + elem)
      })
    })
  })

  describe('multiple validators', () => {
    before(() => {
      currValidationList.push('alphaNumeric', 'integerOnly')
    })

    after(() => {
      currValidationList.length = 0
    })

    it('returned value is true', () => {
      inputArr.push('323')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidationList).isValid, true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false and we know which test failed', () => {
      inputArr.push('adfads23')
      inputArr.forEach((elem) => {
        let validationRes = validator.exec(elem, currValidationList)
        assert.strictEqual(validationRes.isValid, false, 'failed for input => ' + elem)
        assert.strictEqual(validationRes.testKey, 'integerOnly', 'testKey failed for input => ' + elem)
      })
    })
  })
})
