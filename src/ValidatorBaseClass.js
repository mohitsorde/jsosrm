/**
 * Created By: Mohit Sorde
 * on: 07-February-2019
 */
'use strict'

const GenericUtilityClass = require('./GenericUtilityClass')

const validatorMap = {}

/**
 * validates string provided contains only alphabetical characters
 * @param {string} val
 */
function aplhabetical (val) {
  return typeof val === 'string' && /^[a-zA-Z]+$/.test(val)
}

validatorMap['aplhabetical'] = {
  desc: 'validates string provided contains only alphabetical characters',
  impl: aplhabetical
}

/**
 * validates string provided conforms to the pattern January 09, 2009
 * @param {string} val
 */
function dateOfBirth (val) {
  return /^[A-Za-z]+\s[0-9]{1,2},\s[0-9]{4}$/.test(val)
}

validatorMap['dateOfBirth'] = {
  desc: 'validates string provided conforms to the pattern January 09, 2009',
  impl: dateOfBirth
}

/**
 * validates string provided conforms to the pattern 09/2001
 * @param {string} val
 */
function cardExpiry (val) {
  return /^[0-9]{1,2}\/[0-9]{4}$/.test(val)
}

validatorMap['cardExpiry'] = {
  desc: 'validates string provided conforms to the pattern 09/2001',
  impl: cardExpiry
}

/**
 * validates string provided contains only aplhanumeric characters
 * @param {string} val
 */
function alphaNumeric (val) {
  return typeof val === 'string' && /^[a-zA-Z0-9]+$/.test(val)
}

validatorMap['alphaNumeric'] = {
  desc: 'validates string provided contains only aplhanumeric characters',
  impl: alphaNumeric
}

/**
 * ensures valid people names are allowed
 * @param {string} val
 */
function nameOnly (val) {
  if (typeof val !== 'string' || !val) {
    return false
  }
  if (val.length === 1) {
    return validatorMap['aplhabetical'](val)
  }
  return /^[a-zA-Z][a-zA-Z. ,]*[a-zA-Z.]$/.test(val)
}

validatorMap['nameOnly'] = {
  desc: 'ensures valid people names are allowed',
  impl: nameOnly
}

/**
 * validates string provided conforms to email pattern
 * @param {string} val
 */
function emailId (val) {
  return /^\w+([!#$%&‘*+–/=?^`.{|}~-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)
  /// ^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
}

validatorMap['emailId'] = {
  desc: 'validates email pattern',
  impl: emailId
}

/**
 * validates only positive integers are allowed
 * @param {*} val
 */
function naturalNumber (val) {
  return /^[1-9][0-9]*$/.test(val)
}

validatorMap['naturalNumber'] = {
  desc: 'validates only positive integers are allowed',
  impl: naturalNumber
}

/**
 * validates only integers are allowed
 * @param {*} val
 */
function integerOnly (val) {
  return /^-?[1-9][0-9]*$/.test(val)
}

validatorMap['integerOnly'] = {
  desc: 'validates only integers are allowed',
  impl: integerOnly
}

/**
 * validates descimal numbers or their subset is allowed
 * @param {*} val
 */
function floatingNumber (val) {
  return /^-?[0-9]+\.?[0-9]*$/.test(val)
}

validatorMap['floatingNumber'] = {
  desc: 'validates postive or negative decimals is allowed',
  impl: floatingNumber
}

/**
 * validates postive decimals is allowed
 * @param {*} val
 */
function positiveFloatingNumber (val) {
  return this.validatorMap['floatingNumber'](val) && parseFloat(val) > 0
}

validatorMap['positiveFloatingNumber'] = {
  desc: 'validates only postive decimals is allowed',
  impl: positiveFloatingNumber
}

/**
 * validates only non-negative decimals is allowed
 * @param {*} val
 */
function nonNegativeFloatingNumber (val) {
  return this.validatorMap['floatingNumber'](val) && parseFloat(val) >= 0
}

validatorMap['nonNegativeFloatingNumber'] = {
  desc: 'validates only non-negative decimals is allowed',
  impl: nonNegativeFloatingNumber
}

/**
 * ensures valid address is provided
 * @param {string} val
 */
function addressOnly (val) {
  return /^[-0-9a-zA-Z./&`~@#()_"'., ]+$/.test(val)
}

validatorMap['addressOnly'] = {
  desc: 'ensures valid address is provided',
  impl: addressOnly
}

/**
 * ensures valid pin code is provided
 * @param {*} val
 */
function pinCode (val) {
  return /^[-0-9a-zA-Z ]+$/.test(val)
}

validatorMap['pinCode'] = {
  desc: 'ensures valid pin code is provided',
  impl: pinCode
}

/**
 * validatesintegers greater than or equal to 0 are allowed
 * @param {*} val
 */
function wholeNumber (val) {
  return /^[0-9]+$/.test(val)
}

validatorMap['wholeNumber'] = {
  desc: 'ensures whole number is provided',
  impl: wholeNumber
}

let innerMap = {
  'true': 1,
  'false': 0
}

/**
 * ensures boolean or string that evaluates as boolean values is provided
 * @param {*} val
 */
function booleanOnly (val) {
  if (typeof val === 'boolean' || innerMap.hasOwnProperty(val)) {
    return true
  }

  return false
}

validatorMap['booleanOnly'] = {
  desc: 'ensures boolean or string that evaluates as boolean values is provided',
  impl: booleanOnly
}

let maxCountList = [
  2,
  3,
  4,
  8,
  16,
  32,
  64,
  128,
  256,
  512
]

let minCountList = [
  2,
  3,
  15,
  16
]

let maxCountKey = 'maxChar'; let minCountKey = 'minChar'

function maxCountHandler (maxCount) {
  /**
 * validates number of characters does not exceed the upper limit
 * @param {*} val
 */
  function innerHandler (val) {
    let regex = new RegExp('^.' + '{0,' + maxCount + '}$')
    return regex.test(val)
  }
  return innerHandler
}

function minCountHandler (minCount) {
  /**
 * validates number of characters does not fall below the lower limit
 * @param {*} val
 */
  function innerHandler (val) {
    let regex = new RegExp('^.' + '{' + minCount + ',}$')
    return regex.test(val)
  }
  return innerHandler
}

for (let elem of maxCountList) {
  validatorMap[ maxCountKey + String(elem) ] = {
    desc: 'validates maximum number of characters in the string is ' + elem,
    impl: maxCountHandler(elem)
  }
}

for (let elem of minCountList) {
  validatorMap[ minCountKey + String(elem) ] = {
    desc: 'validates minimum number of characters in the string is ' + elem,
    impl: minCountHandler(elem)
  }
}

/**
 * validates phone number has no unexpected characters
 * @param {string} val
 */
function phoneNumber (val) {
  return /^\+?[-()0-9]+$/.test(val)
}

validatorMap['phoneNumber'] = {
  desc: 'ensures valid phone number characters are provided',
  impl: phoneNumber
}

function ValidatorBaseClass () {
  this.innerMap = validatorMap
  GenericUtilityClass.apply(this, arguments)
}

ValidatorBaseClass.prototype = Object.create(GenericUtilityClass.prototype)
ValidatorBaseClass.prototype.constructor = ValidatorBaseClass

/**
 * executes each validator identified by the key on input value and returns a promise that resolves to true only if none of the validators fail
 * @param {*} value
 * @param {*} arrayOfUtilKeys
 */
async function asyncValidate (value, arrayOfUtilKeys) {
  let isValid
  for (let validatorKey of arrayOfUtilKeys) {
    this.isValidUtilKey(validatorKey)
    isValid = await this.innerMap[validatorKey](value)
    if (!isValid) {
      return false
    }
  }
  return true
}

/**
 * executes each validator identified by the key on input value and returns true only if none of the validators fail
 * @param {*} value
 * @param {*} arrayOfUtilKeys
 */
function validate (value, arrayOfUtilKeys) {
  for (let validatorKey of arrayOfUtilKeys) {
    this.isValidUtilKey(validatorKey)
    if (!this.innerMap[validatorKey](value)) {
      return false
    }
  }
  return true
}

ValidatorBaseClass.prototype = Object.assign(ValidatorBaseClass.prototype, {
  exec: validate,
  asyncExec: asyncValidate
})

module.exports = ValidatorBaseClass
