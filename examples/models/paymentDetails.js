'use strict'

const ParserBaseClass = require('../../src/ParserBaseClass')
const paymentDetailsSchema = require('../schemas/paymentDetails')
const paymentDetailsGetter = require('../getters/paymentDetailsGetter')

function PaymentDetailsParser (params) {
  ParserBaseClass.apply(this, arguments)
}

PaymentDetailsParser.prototype = Object.create(ParserBaseClass.prototype)
PaymentDetailsParser.prototype.constructor = PaymentDetailsParser
PaymentDetailsParser.prototype.attrDefs = paymentDetailsSchema
PaymentDetailsParser.prototype.getter = paymentDetailsGetter

module.exports = PaymentDetailsParser
