/**
 * Created By: Mohit Sorde
 * on: 21-Feb-2019
 */
'use strict'

const GenericParserClass = require('./GenericParserClass')
const GetterBaseClass = require('./GetterBaseClass')

function ReverseParserBaseClass (params, attrDefs) {
  if (attrDefs) this._attrDefs = attrDefs
  GenericParserClass.apply(this, arguments)
}

function _handleParser (paramObj, GenericParserClassArg) {
  if (Array.isArray(GenericParserClassArg)) {
    GenericParserClassArg = GenericParserClassArg[0]
    let parsedArr = []
    if (!Array.isArray(paramObj)) {
      paramObj = [paramObj]
    }
    for (let elem of paramObj) {
      parsedArr.push((new GenericParserClassArg(elem)).getParams())
    }
    return parsedArr
  }
  return (new GenericParserClassArg(paramObj)).getParams()
}

function parseParams (params) {
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

ReverseParserBaseClass.prototype = Object.create(GenericParserClass.prototype)
ReverseParserBaseClass.prototype = Object.assign(ReverseParserBaseClass.prototype, {
  constructor: ReverseParserBaseClass,
  parseParams,
  _handleParser,
  _attrDefs: {},
  getter: new GetterBaseClass()
})

module.exports = ReverseParserBaseClass
