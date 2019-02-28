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

function ParserBaseClass (params, attrDefs, asyncHandle) {
  this.asyncHandle = asyncHandle
  if (attrDefs) this._attrDefs = attrDefs
  GenericParserClass.apply(this, arguments)
}

function _validateAndParse (val, validatorArr, setterArr) {
  if (!this.validator.exec(val, validatorArr)) {
    return {
      errCode: 'INVALID_INPUT'
    }
  }

  return this.setter.exec(val, setterArr)
}

function _handleParser (paramObj, GenericParserClassArg) {
  if (Array.isArray(GenericParserClassArg)) {
    GenericParserClassArg = GenericParserClassArg[0]
    let parsedArr = []
    if (!Array.isArray(paramObj)) {
      paramObj = [paramObj]
    }
    for (let elem of paramObj) {
      let parsedObj = (new GenericParserClassArg(elem)).getParams()
      if (typeof parsedObj === 'object' && parsedObj['errCode']) {
        parsedArr = parsedObj
        break
      }
      parsedArr.push(parsedObj)
    }
    return parsedArr
  }
  return (new GenericParserClassArg(paramObj)).getParams()
}

function parseParams (params) {
  if (this.asyncHandle) {
    return this._asyncParseParams(params)
  }
  let parsedObj = Object.assign({}, params) // = {} to skip attributes not defined in the schema
  for (let key in params) {
    let attrDef = this._attrDefs[key]
    if (!attrDef) { continue }
    if (attrDef['optional'] && !params[key]) continue
    if (attrDef['parser']) parsedObj[key] = this._handleParser(params[key], attrDef['parser'])
    else if (attrDef['validators']) parsedObj[key] = this._validateAndParse(params[key], attrDef['validators'], attrDef['setters'])
    else parsedObj[key] = this.setter.exec(params[key], attrDef['setters'])

    if (typeof parsedObj[key] === 'object' && parsedObj[key]['errCode']) {
      parsedObj[key]['errParam'] = parsedObj[key]['errParam'] || key
      this.err = parsedObj[key]
      break
    }
  }

  return parsedObj
}

async function _asyncvalidateAndParse (val, validatorArr, setterArr) {
  let validated = await this.validator.asyncExec(val, validatorArr)
  if (!validated) {
    let err = {
      errCode: 'INVALID_INPUT'
    }
    return Promise.reject(err)
  }

  return this.setter.asynExec(val, setterArr)
}

async function _asyncHandleParser (paramObj, GenericParserClassArg) {
  if (Array.isArray(GenericParserClassArg)) {
    GenericParserClassArg = GenericParserClassArg[0]
    let parsedArr = []
    if (!Array.isArray(paramObj)) {
      paramObj = [paramObj]
    }
    for (let elem of paramObj) {
      let parsedObj
      try {
        parsedObj = await (new GenericParserClassArg(elem, null, true)).getParams()
      } catch (e) {
        return Promise.reject(e)
      }
      parsedArr.push(parsedObj)
    }
    return parsedArr
  }
  return (new GenericParserClassArg(paramObj, null, true)).getParams()
}

async function _asyncParseParams (params) {
  let parsedObj = Object.assign({}, params) // = {} to skip attributes not defined in the schema
  for (let key in params) {
    let attrDef = this._attrDefs[key]
    if (!attrDef) { continue }
    if (attrDef['optional'] && !params[key]) continue
    try {
      if (attrDef['parser']) parsedObj[key] = await this._asyncHandleParser(params[key], attrDef['parser'])
      else if (attrDef['validators']) parsedObj[key] = await this._asyncvalidateAndParse(params[key], attrDef['validators'], attrDef['setters'])
      else parsedObj[key] = await this.setter.asyncExec(params[key], attrDef['setters'])
    } catch (e) {
      if (typeof e === 'object' && e['errCode']) {
        parsedObj[key]['errParam'] = e['errParam'] || key
        parsedObj[key]['errCode'] = e['errCode']
      } else {
        parsedObj[key]['errParam'] = key
        parsedObj[key]['errCode'] = e
      }
      this.err = Promise.reject(parsedObj[key])
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
    return (new ReverseParseBaseClass(params, this._attrDefs, this.getter)).getParams()
  }
  if (!this.reverseParams) {
    this.reverseParams = new ReverseParseBaseClass(params, this._attrDefs, this.getter)
  }
  return this.reverseParams.getParams()
}

async function _asyncReverseParams (params) {
  if (!params) {
    let err = await this.getErr()
    if (!err) params = await this.getParams()
    else return this.getErr()
  } else {
    return (new ReverseParseBaseClass(params, this._attrDefs, this.getter, true)).getParams()
  }
  if (!this.reverseParams) {
    this.reverseParams = new ReverseParseBaseClass(params, this._attrDefs, this.getter, true)
  }
  return this.reverseParams.getParams()
}

ParserBaseClass.prototype = Object.create(GenericParserClass.prototype)

ParserBaseClass.prototype = Object.assign(ParserBaseClass.prototype, {
  constructor: ParserBaseClass,
  _attrDefs: {},
  _validateAndParse,
  _handleParser,
  _asyncParseParams,
  _asyncHandleParser,
  _asyncvalidateAndParse,
  _asyncReverseParams,
  parseParams,
  validator: new ValidatorBaseClass(),
  setter: new SetterBaseClass(),
  getter: new GetterBaseClass(),
  getReverseParams
})

module.exports = ParserBaseClass
