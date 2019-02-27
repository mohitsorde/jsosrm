'use strict'

const GetterBaseClass = require('../../src/GetterBaseClass')

const paymentDetailsGetter = new GetterBaseClass()

paymentDetailsGetter.push('maskCardNumbers', function (val) {
  return val.replace(/([0-9]{12})([0-9]+)/, '************$2')
}, 'masks all digits except the last 4')

module.exports = paymentDetailsGetter
