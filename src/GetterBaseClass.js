/**
 * Created By: Mohit Sorde
 * on: 19-February-2019
 */
'use strict'

const GenericUtilityClass = require('./GenericUtilityClass')

const innerMapAsBoolean = {
  'true': true,
  'false': false
}

/**
 * converts literals to boolean type
 * @param {string} val - one of true or false
 */
function asBoolean (val) {
  return innerMapAsBoolean[val]
}

/**
 * converts literal to Number type
 * @param {string} val
 */
function asNumber (val) {
  return Number(val)
}

/**
 * returns value or object described by input
 * @param {string} val
 */
function asJson (val) {
  if (typeof val === 'string') {
    try {
      val = JSON.parse(val)
    } catch (e) {
      return val
    }
  }
  return val
}

/**
 * converts input to lower case
 * @param {string} val
 */
function asLower (val) {
  return val.toLowerCase()
}

/**
 * converts input to upper case
 * @param {string} val
 */
function asUpper (val) {
  return val.toUpperCase()
}

/**
 * converts input to date string
 * @param {*} val
 */
function dateAsString (val) {
  return new Date(val).toDateString()
}

function GetterBaseClass () {
  this.innerMap = {
    'asBoolean': {
      desc: 'converts literals to boolean type',
      impl: asBoolean
    },
    'asNumber': {
      desc: 'converts literal to Number type',
      impl: asNumber
    },
    'asJson': {
      desc: 'returns JSON parsed input',
      impl: asJson
    },
    'asLower': {
      desc: 'converts input to lower case',
      impl: asLower
    },
    'asUpper': {
      desc: 'converts input to upper case',
      impl: asUpper
    },
    'dateAsString': {
      desc: 'converts input to date string',
      impl: dateAsString
    }
  }
  GenericUtilityClass.apply(this, arguments)
}

GetterBaseClass.prototype = Object.create(GenericUtilityClass.prototype)
GetterBaseClass.prototype.constructor = GetterBaseClass

module.exports = GetterBaseClass
