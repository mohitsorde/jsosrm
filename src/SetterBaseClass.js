/**
 * Created By: Mohit Sorde
 * on: 11-February-2019
 */
'use strict'

const GenericUtilityClass = require('./GenericUtilityClass')

/**
 * replace html characters in input with escaped sequence
 * @param {*} val
 */
function htmlEncode (val) {
  return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * sets input string lower cased
 * @param {string} val
 */
function toLower (val) {
  return val.toLowerCase()
}

/**
 * converts valid inut date into millisecond unit
 * @param {*} val
 */
function dateInMilliSec (val) {
  return (new Date(val)).getTime()
}

/**
 *  sets default day to 01 for input and format the output as MM/01/YYYY
 * @param {string} val - string of the format MM/YYYY
 */
function formatCardExpiry (val) {
  return val.replace(/^([0-9]{1,2}\/)([0-9]{4})$/, '$101/$2')
}

/**
 * sets input string upper cased
 * @param {*} val
 */
function toUpper (val) {
  return val.toUpperCase()
}

/**
 * sets wrong cased names correct - eg: eveLyN lOVe to Evelyn Love
 * @param {string} val
 */
function nameFormat (val) {
  if (val.length > 1) {
    val = this.innerMap['toLower']['impl'](val)
    // value = value.replace(/([.\s][a-z])/g, "$1");
    let innerArr = []
    let flag = true
    let currChar
    for (let i = 0; i < val.length; i++) {
      currChar = val[i]
      if (flag) {
        innerArr.push(currChar.toUpperCase())
        flag = false
      } else {
        innerArr.push(currChar)
      }
      if (currChar === ' ' || currChar === '.' || currChar === ',') {
        flag = true
      }
    }
    val = innerArr.join('')
  } else if (val.length === 1) {
    val = val.toUpperCase()
  }

  return val
}

/**
 * converts any type of input to string
 * @param {*} val
 */
function toString (val) {
  if (typeof val !== 'string') {
    val = JSON.stringify(val)
  }

  return val
}

/**
 * converts number to floating value
 * @param {number} val
 */
function toFloat (val) {
  return parseFloat(val)
}

function SetterBaseClass () {
  this.innerMap = {
    'htmlEncode': {
      desc: 'replace html characters in input with escaped sequence',
      impl: htmlEncode
    },
    'toLower': {
      desc: 'sets input string lower cased',
      impl: toLower
    },
    'dateInMilliSec': {
      desc: 'converts valid inut date into millisecond unit',
      impl: dateInMilliSec
    },
    'formatCardExpiry': {
      desc: 'sets default day to 01 for input',
      impl: formatCardExpiry
    },
    'toUpper': {
      desc: 'sets input string upper cased',
      impl: toUpper
    },
    'nameFormat': {
      desc: 'sets wrong cased names correct - eg: eveLyN lOVe to Evelyn Love',
      impl: nameFormat
    },
    'toString': {
      desc: 'converts any type of input to string',
      impl: toString
    },
    'toFloat': {
      desc: 'converts number to floating value',
      impl: toFloat
    }
  }
  GenericUtilityClass.apply(this, arguments)
}

SetterBaseClass.prototype = Object.create(GenericUtilityClass.prototype)
SetterBaseClass.prototype.constructor = SetterBaseClass

module.exports = SetterBaseClass
