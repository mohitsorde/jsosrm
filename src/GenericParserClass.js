/**
 * Created By: Mohit Sorde
 * on: 21-Feb-2019
 */
'use strict'

function GenericParserClass (params) {
  this.err = null
  this.params = this.parseParams(params)
}

function getErr () {
  return this.err
}

function getParams () {
  return this.getErr() || this.params
}

function parseParams (params) {
  return params
}

GenericParserClass.prototype = {
  constructor: GenericParserClass,
  getErr,
  parseParams,
  getParams
}

module.exports = GenericParserClass
