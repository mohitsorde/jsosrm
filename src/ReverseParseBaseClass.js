/**
 * Created By: Mohit Sorde
 * on: 21-Feb-2019
 */
'use strict'

const GenericParserClass = require('./GenericParserClass')
const GetterBaseClass = require('./GetterBaseClass')

function ReverseParserBaseClass (params, attrDefs, getter, asyncHandle) {
  this.asyncHandle = asyncHandle
  if (attrDefs) this._attrDefs = attrDefs
  if (getter) this.getter = getter
  GenericParserClass.apply(this, arguments)
}

function _handleParser (paramObj, ParserClassArg) {
  if (Array.isArray(ParserClassArg)) {
    ParserClassArg = ParserClassArg[0]
    let parsedArr = []
    if (!Array.isArray(paramObj)) {
      paramObj = [paramObj]
    }
    for (let elem of paramObj) {
      parsedArr.push((new ParserClassArg()).getReverseParams(elem))
    }
    return parsedArr
  }
  return (new ParserClassArg()).getReverseParams(paramObj)
}

function parseParams (params) {
  if (this.asyncHandle) { return this._asyncParseParams(params) }
  let parsedObj = {}
  for (let key in params) {
    let attrDef = this._attrDefs[key]
    if (!attrDef || !params[key]) {
      parsedObj[key] = params[key]
      continue
    }
    if (attrDef['parser']) parsedObj[key] = this._handleParser(params[key], attrDef['parser'])
    else if (!attrDef['getters']) {
      parsedObj[key] = params[key]
      continue
    } else parsedObj[key] = this.getter.exec(params[key], attrDef['getters'])
  }

  return parsedObj
}

async function _asyncHandleParser (paramObj, ParserClassArg) {
  if (Array.isArray(ParserClassArg)) {
    ParserClassArg = ParserClassArg[0]
    let parsedArr = []
    if (!Array.isArray(paramObj)) {
      paramObj = [paramObj]
    }
    for (let elem of paramObj) {
      let revParsedObj = await (new ParserClassArg()).getReverseParams(elem, true)
      parsedArr.push(revParsedObj)
    }
    return parsedArr
  }
  return (new ParserClassArg()).getReverseParams(paramObj, true)
}

async function _asyncParseParams (params) {
  let parsedObj = {}
  for (let key in params) {
    let attrDef = this._attrDefs[key]
    if (!attrDef || !params[key]) {
      parsedObj[key] = params[key]
      continue
    }
    if (attrDef['parser']) parsedObj[key] = await this._asyncHandleParser(params[key], attrDef['parser'])
    else if (!attrDef['getters']) {
      parsedObj[key] = params[key]
      continue
    } else parsedObj[key] = await this.getter.asyncExec(params[key], attrDef['getters'])
  }

  return parsedObj
}

ReverseParserBaseClass.prototype = Object.create(GenericParserClass.prototype)
ReverseParserBaseClass.prototype = Object.assign(ReverseParserBaseClass.prototype, {
  constructor: ReverseParserBaseClass,
  parseParams,
  _handleParser,
  _asyncParseParams,
  _asyncHandleParser,
  _attrDefs: {},
  getter: new GetterBaseClass()
})

module.exports = ReverseParserBaseClass
