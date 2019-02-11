/**
 * Created By: Mohit Sorde
 * on: 08-February-2019
 */
'use strict'

function GenericUtilityClass () {}

/**
 * returns object with key as utility identifier and displays description of each utility
 */
function listAll () {
  let utilityDict = {}
  let keysList = Object.keys(this.innerMap)
  keysList.forEach((key) => {
    console.log(key + ' => ' + this.innerMap[key]['desc'])
    utilityDict[key] = key
  })
  if (!keysList.length) console.log('no utility has been defined')
  return utilityDict
}

/**
 * pushes a new validator to Base class or replaces existed validator with new implementation for the provided key
 * @param {string} key
 * @param {Function} impl
 * @param {string} desc
 */
function push (key, impl, desc) {
  desc = desc || (this.innerMap[key] && this.innerMap[key]['desc'])
  this.innerMap[key] = {
    'desc': desc,
    'impl': impl
  }
}

/**
 * throws an error if valid utility key is not provided, else returns true
 * @param {string} utilKey
 */
function isValidUtilKey (utilKey) {
  if (!this.innerMap[utilKey]) throw new Error('Unknown utility key provided')
  return true
}

/**
 * executes each utility identified by the key on value
 * @param {*} value
 * @param {*} arrayOfUtilKeys
 */
function exec (value, arrayOfUtilKeys) {
  for (let utilKey of arrayOfUtilKeys) {
    this.isValidUtilKey(utilKey)
    value = this.innerMap[utilKey]['impl'](value)
  }
  return true
}

/**
 * executes each utility identified by the key on value and returns a promise with resolved value
 * @param {*} value
 * @param {*} arrayOfUtilKeys
 */
async function asyncExec (value, arrayOfUtilKeys) {
  for (let utilKey of arrayOfUtilKeys) {
    this.isValidUtilKey(utilKey)
    value = await this.innerMap[utilKey]['impl'](value)
  }
  return true
}

GenericUtilityClass.prototype = Object.assign(GenericUtilityClass.prototype, {
  listAll,
  push,
  exec,
  asyncExec,
  isValidUtilKey,
  innerMap: {}
})

module.exports = GenericUtilityClass
