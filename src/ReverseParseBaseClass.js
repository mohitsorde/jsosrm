/**
 * Created By: Mohit Sorde
 * on: 21-Feb-2019
 */
'use strict'

const GenericParserClass = require('./GenericParserClass')
const GetterBaseClass = require('./GetterBaseClass')

function ReverseParserBaseClass (params, attrDefs, getter, asyncHandle) {
  this.asyncHandle = asyncHandle
  if (attrDefs) this.attrDefs = attrDefs
  if (getter) this.getter = getter
  GenericParserClass.apply(this, arguments)
}

function _handleDeepArray (inputArr, cb) {
  let outputArr = []
  for (let elem of inputArr) {
    if (!Array.isArray(elem)) outputArr.push(cb(elem))
    else if (!elem.length) outputArr.push([])
    else outputArr.push(this._handleDeepArray(elem, cb))
  }
  return outputArr
}

function _handleParser (paramObj, ParserClassArg) {
  if (Array.isArray(ParserClassArg)) {
    ParserClassArg = ParserClassArg[0]
    if (!Array.isArray(paramObj)) {
      paramObj = [paramObj]
    }
    return this._handleDeepArray(
      paramObj,
      elem => (new ParserClassArg()).getReverseParams(elem)
    )
  }
  return (new ParserClassArg()).getReverseParams(paramObj)
}

function _parseParams (params) {
  if (this.asyncHandle) { return this._asyncParseParams(params) }
  let parsedObj = Object.assign({}, params)
  for (let attrKey in this.attrDefs) {
    let attrDef = this.attrDefs[attrKey]
    let key = attrDef['outKey'] || attrKey
    if (!params[key]) continue
    if (Array.isArray(attrDef) && Array.isArray(params[key])) {
      parsedObj[key] = this._handleDeepArray(
        params[key],
        elem => this.getter.exec(elem, attrDef[0]['getters'])
      )
    } else if (attrDef['parser']) parsedObj[key] = this._handleParser(params[key], attrDef['parser'])
    else if (!attrDef['getters']) continue
    else parsedObj[key] = this.getter.exec(params[key], attrDef['getters'])
  }

  return parsedObj
}

async function _asyncHandleDeepArray (inputArr, cb) {
  let outputArr = []
  for (let elem of inputArr) {
    if (!Array.isArray(elem)) {
      let parsedObj = await cb(elem)
      outputArr.push(parsedObj)
    } else if (!elem.length) outputArr.push([])
    else {
      let parsedObj = await this._handleDeepArray(elem, cb)
      outputArr.push(parsedObj)
    }
  }
  return outputArr
}

async function _asyncHandleParser (paramObj, ParserClassArg) {
  if (Array.isArray(ParserClassArg)) {
    ParserClassArg = ParserClassArg[0]
    if (!Array.isArray(paramObj)) {
      paramObj = [paramObj]
    }
    return this._asyncHandleDeepArray(
      paramObj,
      async elem => {
        let revParsedObj = await (new ParserClassArg()).getReverseParams(elem, true)
        return revParsedObj
      }
    )
  }
  return (new ParserClassArg()).getReverseParams(paramObj, true)
}

async function _asyncParseParams (params) {
  let parsedObj = Object.assign({}, params)
  for (let attrKey in this.attrDefs) {
    let attrDef = this.attrDefs[attrKey]
    let key = attrDef['outKey'] || attrKey
    if (!params[key]) continue
    if (Array.isArray(attrDef) && Array.isArray(params[key])) {
      parsedObj[key] = await this._asyncHandleDeepArray(
        params[key],
        async elem => {
          let val = await this.getter.asyncExec(elem, attrDef[0]['getters'])
          return val
        }
      )
    } else if (attrDef['parser']) parsedObj[key] = await this._asyncHandleParser(params[key], attrDef['parser'])
    else if (!attrDef['getters']) continue
    else parsedObj[key] = await this.getter.asyncExec(params[key], attrDef['getters'])
  }

  return parsedObj
}

ReverseParserBaseClass.prototype = Object.create(GenericParserClass.prototype)
ReverseParserBaseClass.prototype = Object.assign(ReverseParserBaseClass.prototype, {
  constructor: ReverseParserBaseClass,
  _parseParams,
  _handleParser,
  _asyncParseParams,
  _asyncHandleParser,
  _handleDeepArray,
  _asyncHandleDeepArray,
  attrDefs: {},
  getter: new GetterBaseClass()
})

module.exports = ReverseParserBaseClass
