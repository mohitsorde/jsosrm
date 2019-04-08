'use strict'

const ParserBaseClass = require('../../src/ParserBaseClass')
const userAddressSchema = require('../schemas/userAddress')

function UserAddressParser (params) {
  ParserBaseClass.apply(this, arguments)
}

UserAddressParser.prototype = Object.create(ParserBaseClass.prototype)
UserAddressParser.prototype.constructor = UserAddressParser
UserAddressParser.prototype.attrDefs = userAddressSchema

module.exports = UserAddressParser
