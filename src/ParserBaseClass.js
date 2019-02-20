/**
 * Created By: Mohit Sorde
 * on: 19-Feb-2019
 */
'use strict'

const ValidatorBaseClass = require('./ValidatorBaseClass')
const SetterBaseClass = require('./SetterBaseClass')

function ParserClass (params, attrDefs) {
  if (attrDefs) this._attrDefs = attrDefs
  this.err = null
  this.params = this.parseParams(params)
}

function getErr () {
  return this.err
}

function getParams () {
  return this.getErr() || this.params
}

function _validateAndParse (val, validatorArr, setterArr) {
  if (!this.validator.exec(val, validatorArr)) {
    return {
      errCode: 'INVALID_INPUT'
    }
  }

  if (setterArr) return this.setter.exec(val, setterArr)
}

function _handleParser (paramObj, ParserClassArg) {
  if (Array.isArray(ParserClassArg)) {
    ParserClassArg = ParserClassArg[0]
    let parsedArr = []
    if (!Array.isArray(paramObj)) {
      paramObj = [paramObj]
    }
    for (let elem of paramObj) {
      let parsedObj = (new ParserClassArg(elem)).getParams()
      if (typeof parsedObj === 'object' && parsedObj['errCode']) {
        parsedArr = parsedObj
        break
      }
      parsedArr.push(parsedObj)
    }
    return parsedArr
  }
  return (new ParserClassArg(paramObj)).getParams()
}

function parseParams (params) {
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

let _attrDefs = {}

ParserClass.prototype = {
  constructor: ParserClass,
  getErr,
  parseParams,
  getParams,
  _attrDefs,
  _validateAndParse,
  _handleParser,
  validator: new ValidatorBaseClass(),
  setter: new SetterBaseClass()
}

module.exports = ParserClass
