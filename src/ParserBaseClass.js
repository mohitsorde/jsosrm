/**
 * Created By: Mohit Sorde
 * on: 19-Feb-2019
 */
'use strict'

const GenericParserClass = require('./GenericParserClass')
const ValidatorBaseClass = require('./ValidatorBaseClass')
const SetterBaseClass = require('./SetterBaseClass')
const ReverseParseBaseClass = require('./ReverseParseBaseClass')
const GetterBaseClass = require('./GetterBaseClass')

const checkStrictNull = (val) => {
  // let typeOfVal = typeof val
  // if (typeOfVal === 'boolean' || typeOfVal === 'number') {
  //   return false
  // }
  // return !val
  return typeof val === 'undefined'
}

function ParserBaseClass (params, update, asyncHandle, attrDefs) {
  this.update = update
  this.asyncHandle = asyncHandle
  if (attrDefs) this.attrDefs = attrDefs
  GenericParserClass.apply(this, arguments)
}

function _validateAndParse (val, validatorArr, setterArr) {
  let validationRes = this.validator.exec(val, validatorArr)
  if (!validationRes.isValid) {
    return {
      errCode: 'INVALID_INPUT',
      testKey: validationRes.testKey
    }
  }

  return this.setter.exec(val, setterArr)
}

function _handleDeepArray (inputArr, cb) {
  let outputArr = []
  let ind = 0
  for (let elem of inputArr) {
    if (!Array.isArray(elem)) {
      let parsedObj = cb(elem)
      if (typeof parsedObj === 'object' && parsedObj['errCode']) {
        parsedObj['errParam'] = JSON.stringify(ind) + ((parsedObj['errParam'] && ('.' + parsedObj['errParam'])) || '')
        outputArr = parsedObj
        break
      }
      outputArr.push(parsedObj)
    } else if (!elem.length) {
      outputArr.push([])
    } else {
      let parsedObj = this._handleDeepArray(elem, cb)
      if (typeof parsedObj === 'object' && parsedObj['errCode']) {
        parsedObj['errParam'] = JSON.stringify(ind) + ((parsedObj['errParam'] && ('.' + parsedObj['errParam'])) || '')
        outputArr = parsedObj
        break
      }
      outputArr.push(parsedObj)
    }
    ind = ind + 1
  }
  return outputArr
}

function _handleParser (paramObj, GenericParserClassArg) {
  if (Array.isArray(GenericParserClassArg)) {
    GenericParserClassArg = GenericParserClassArg[0]
    if (!Array.isArray(paramObj)) {
      let parsedObj = (new GenericParserClassArg(paramObj, this.update)).getParams()
      if (typeof parsedObj === 'object' && parsedObj['errCode']) return parsedObj
      return [parsedObj]
    }
    let cb = (elem) => (new GenericParserClassArg(elem, this.update)).getParams()
    return this._handleDeepArray(paramObj, cb)
  }
  return (new GenericParserClassArg(paramObj, this.update)).getParams()
}

function _handleArray (paramArr, attrDef) {
  if (!Array.isArray(paramArr)) {
    let parsedObj = this._validateAndParse(paramArr, attrDef['validators'], attrDef['setters'])
    if (typeof parsedObj === 'object' && parsedObj['errCode']) return parsedObj
    return [parsedObj]
  }
  let cb = (elem) => this._validateAndParse(elem, attrDef['validators'], attrDef['setters'])
  return this._handleDeepArray(paramArr, cb)
}

function _parseParams (params) {
  if (this.asyncHandle) {
    return this._asyncParseParams(params)
  }
  let parsedObj = Object.assign({}, params) // = {} to skip attributes not defined in the schema
  for (let key in this.attrDefs) {
    let attrDef = this.attrDefs[key]
    if (checkStrictNull(params[key])) {
      if (attrDef['optional']) continue
      if (this.update) {
        delete parsedObj[key]
        continue
      }
      parsedObj[key] = {
        errCode: 'NULL_INPUT',
        errParam: key
      }
      this.err = parsedObj[key]
      break
    }
    let outKey = key
    if (Array.isArray(attrDef)) {
      outKey = attrDef[0]['outKey'] || outKey
      parsedObj[outKey] = this._handleArray(params[key], attrDef[0])
    } else if (attrDef['parser']) {
      outKey = attrDef['outKey'] || outKey
      parsedObj[outKey] = this._handleParser(params[key], attrDef['parser'])
    } else {
      outKey = attrDef['outKey'] || outKey
      parsedObj[outKey] = this._validateAndParse(params[key], attrDef['validators'], attrDef['setters'])
    }

    if (outKey !== key) delete parsedObj[key]

    if (typeof parsedObj[outKey] === 'object' && parsedObj[outKey]['errCode']) {
      if (parsedObj[outKey]['errParam']) parsedObj[outKey]['errParam'] = key + '.' + parsedObj[outKey]['errParam']
      else parsedObj[outKey]['errParam'] = key
      this.err = parsedObj[outKey]
      break
    }
  }

  return parsedObj
}

async function _asyncvalidateAndParse (val, validatorArr, setterArr) {
  let validationRes = await this.validator.asyncExec(val, validatorArr)
  if (!validationRes.isValid) {
    let err = {
      errCode: 'INVALID_INPUT',
      testKey: validationRes.testKey
    }
    return Promise.reject(err)
  }

  return this.setter.asyncExec(val, setterArr)
}

async function _asyncHandleDeepArray (inputArr, cb) {
  let outputArr = []
  let ind = 0
  for (let elem of inputArr) {
    if (!Array.isArray(elem)) {
      try {
        let parsedObj = await cb(elem)
        outputArr.push(parsedObj)
      } catch (parsedObj) {
        if (typeof parsedObj === 'object' && parsedObj['errCode']) {
          parsedObj['errParam'] = JSON.stringify(ind) + ((parsedObj['errParam'] && ('.' + parsedObj['errParam'])) || '')
        }
        return Promise.reject(parsedObj)
      }
    } else if (!elem.length) {
      outputArr.push([])
    } else {
      try {
        let parsedObj = await this._asyncHandleDeepArray(elem, cb)
        outputArr.push(parsedObj)
      } catch (parsedObj) {
        if (typeof parsedObj === 'object' && parsedObj['errCode']) {
          parsedObj['errParam'] = JSON.stringify(ind) + ((parsedObj['errParam'] && ('.' + parsedObj['errParam'])) || '')
        }
        return Promise.reject(parsedObj)
      }
    }
    ind = ind + 1
  }
  return outputArr
}

async function _asyncHandleParser (paramObj, GenericParserClassArg) {
  if (Array.isArray(GenericParserClassArg)) {
    GenericParserClassArg = GenericParserClassArg[0]
    if (!Array.isArray(paramObj)) {
      try {
        let parsedObj = await (new GenericParserClassArg(paramObj, this.update, true)).getParams()
        return [parsedObj]
      } catch (e) {
        return Promise.reject(e)
      }
    }
    let cb = async (elem) => {
      let parsedObj = await (new GenericParserClassArg(elem, this.update, true)).getParams()
      return parsedObj
    }
    return this._asyncHandleDeepArray(paramObj, cb)
  }
  return (new GenericParserClassArg(paramObj, this.update, true)).getParams()
}

async function _asyncHandleArray (paramArr, attrDef) {
  if (!Array.isArray(paramArr)) {
    try {
      let parsedObj = await this._asyncvalidateAndParse(paramArr, attrDef['validators'], attrDef['setters'])
      return [parsedObj]
    } catch (e) {
      return Promise.reject(e)
    }
  }
  let cb = async (elem) => {
    let parsedObj = await this._asyncvalidateAndParse(elem, attrDef['validators'], attrDef['setters'])
    return parsedObj
  }
  return this._asyncHandleDeepArray(paramArr, cb)
}

async function _asyncParseParams (params) {
  let parsedObj = Object.assign({}, params) // = {} to skip attributes not defined in the schema
  for (let key in this.attrDefs) {
    let attrDef = this.attrDefs[key]
    if (checkStrictNull(params[key])) {
      if (attrDef['optional']) continue
      if (this.update) {
        delete parsedObj[key]
        continue
      }
      parsedObj[key] = {
        errCode: 'NULL_INPUT',
        errParam: key
      }
      this.err = Promise.reject(parsedObj[key])
      return this.err
    }
    let outKey = key
    try {
      if (Array.isArray(attrDef)) {
        outKey = attrDef[0]['outKey'] || outKey
        parsedObj[outKey] = await this._asyncHandleArray(params[key], attrDef[0])
      } else if (attrDef['parser']) {
        outKey = attrDef['outKey'] || outKey
        parsedObj[outKey] = await this._asyncHandleParser(params[key], attrDef['parser'])
      } else {
        outKey = attrDef['outKey'] || outKey
        parsedObj[outKey] = await this._asyncvalidateAndParse(params[key], attrDef['validators'], attrDef['setters'])
      }
      if (outKey !== key) delete parsedObj[key]
    } catch (e) {
      if (typeof e === 'object' && e['errCode']) {
        parsedObj[outKey] = {}
        if (e['errParam']) parsedObj[outKey]['errParam'] = key + '.' + e['errParam']
        else parsedObj[outKey]['errParam'] = key
        parsedObj[outKey]['errCode'] = e['errCode']
        parsedObj[outKey]['testKey'] = e['testKey']
      } else {
        parsedObj[outKey]['errParam'] = key
        parsedObj[outKey]['errCode'] = e
        parsedObj[outKey]['testKey'] = 'RUNTIME_ERROR'
      }
      this.err = Promise.reject(parsedObj[outKey])
      return this.err
    }
  }

  return parsedObj
}

function getReverseParams (params, asyncHandle) {
  if ((params && asyncHandle) || (!params && this.asyncHandle)) { return this._asyncReverseParams(params) }
  if (!params) {
    if (!this.getErr()) params = this.getParams()
    else return this.getErr()
  } else {
    return (new ReverseParseBaseClass(params, this.attrDefs, this.getter)).getParams()
  }
  if (!this.reverseParams) {
    this.reverseParams = new ReverseParseBaseClass(params, this.attrDefs, this.getter)
  }
  return this.reverseParams.getParams()
}

async function _asyncReverseParams (params) {
  if (!params) {
    let err = await this.getErr()
    if (!err) params = await this.getParams()
    else return this.getErr()
  } else {
    return (new ReverseParseBaseClass(params, this.attrDefs, this.getter, true)).getParams()
  }
  if (!this.reverseParams) {
    this.reverseParams = new ReverseParseBaseClass(params, this.attrDefs, this.getter, true)
  }
  return this.reverseParams.getParams()
}

ParserBaseClass.prototype = Object.create(GenericParserClass.prototype)

ParserBaseClass.prototype = Object.assign(ParserBaseClass.prototype, {
  constructor: ParserBaseClass,
  attrDefs: {},
  _validateAndParse,
  _handleParser,
  _asyncParseParams,
  _asyncHandleParser,
  _asyncvalidateAndParse,
  _asyncReverseParams,
  _handleArray,
  _asyncHandleArray,
  _parseParams,
  _handleDeepArray,
  _asyncHandleDeepArray,
  validator: new ValidatorBaseClass(),
  setter: new SetterBaseClass(),
  getter: new GetterBaseClass(),
  getReverseParams
})

module.exports = ParserBaseClass
