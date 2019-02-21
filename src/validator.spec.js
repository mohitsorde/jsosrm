'use strict'

const assert = require('chai').assert

const ValidatorBaseClass = require('./ValidatorBaseClass')

describe('validators => ', () => {
  let currValidator = []
  let inputArr = []
  let validator = new ValidatorBaseClass()

  beforeEach(() => {
    inputArr.length = 0
  })

  describe('aplhabetical', () => {
    before(() => {
      currValidator.push('aplhabetical')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input is pure string, irrespective of case sensitivity', () => {
      inputArr.push('testword', 'testWord', 'TESTWORD')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is type other than string or is string containing non alphabetical characters', () => {
      inputArr.push(false, 123, {}, [], undefined, null, '', 'sds0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('dateOfBirth', () => {
    before(() => {
      currValidator.push('dateOfBirth')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input conforms to the pattern January 09, 2009', () => {
      inputArr.push('J 9, 0000', 'January 32, 1111')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input deviates from the pattern January 09, 2009', () => {
      inputArr.push('00/00/0000', 'Jan 0p, 8888', '99 99, 9999', '9')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('cardExpiry', () => {
    before(() => {
      currValidator.push('cardExpiry')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input conforms to the pattern 09/2001', () => {
      inputArr.push('0/0000', '77/7777')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input deviates from the pattern 09/2001', () => {
      inputArr.push('/0000', 'xx/xxxx', '99 99, 9999', 99)
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('alphaNumeric', () => {
    before(() => {
      currValidator.push('alphaNumeric')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input is a string with aplhunumeric characters only', () => {
      inputArr.push('sfwefwefweffe', '2342342315464', 'q34q34324')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input includes characters other than alphanumeric', () => {
      inputArr.push('dfh3298uu 29340', 'sdjirr*sdwe', 99, {}, [])
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('nameOnly', () => {
    before(() => {
      currValidator.push('nameOnly')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input conforms to naming convention', () => {
      inputArr.push('Mr. Smith', 'the one', 'A. D. Julia', 'Bond, James')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input doesn\'t conform to naming convention', () => {
      inputArr.push('@neo', 'mi*shkov ach', 'ero 99 ero', 99, {}, [])
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('emailId', () => {
    before(() => {
      currValidator.push('emailId')
    })

    after(() => {
      currValidator.length = 0
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
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
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
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('naturalNumber', () => {
    before(() => {
      currValidator.push('naturalNumber')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input is a natural number', () => {
      inputArr.push(112, 9)
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is anything other than a natural number', () => {
      inputArr.push(false, 123.01, 0, -3, -8.3, {}, [], undefined, null, '', 'sds0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('integerOnly', () => {
    before(() => {
      currValidator.push('integerOnly')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input is an integer', () => {
      inputArr.push(-112, 9, 0)
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is anything other than an integer', () => {
      inputArr.push(false, 123.01, -8.3, {}, [], undefined, null, '', 'sds0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('floatingNumber', () => {
    before(() => {
      currValidator.push('floatingNumber')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input is a decimal', () => {
      inputArr.push(-112, 9, 0, 0.002, -1.232)
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is anything other than a decimal', () => {
      inputArr.push(false, {}, [], undefined, null, '', 'sds0', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('addressOnly', () => {
    before(() => {
      currValidator.push('addressOnly')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input is a valid address format', () => {
      inputArr.push(
        'NY',
        'A112',
        'B-wing, San Fransisco, CA00123',
        'K3, Lane No. 04, Chennai (38392)'
      )
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is not a valid address', () => {
      inputArr.push(false, {}, [], undefined, null, '', "sd<script src=''></script>")
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })

  describe('booleanOnly', () => {
    before(() => {
      currValidator.push('booleanOnly')
    })

    after(() => {
      currValidator.length = 0
    })

    it('returned value is true if the input is a decimal', () => {
      inputArr.push(true, false, 'true', 'false')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), true, 'failed for input => ' + elem)
      })
    })

    it('returned value is false if input is anything other than a decimal', () => {
      inputArr.push(1, 0, {}, [], undefined, null, '', "sd<script src=''></script>", 'True', 'False')
      inputArr.forEach((elem) => {
        assert.strictEqual(validator.exec(elem, currValidator), false, 'failed for input => ' + elem)
      })
    })
  })
})
