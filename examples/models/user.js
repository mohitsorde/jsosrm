'use strict'

const ParserBaseClass = require('../../src/ParserBaseClass')
const userSchema = require('../schemas/user')

function UserParser (params) {
  ParserBaseClass.apply(this, arguments)
}

UserParser.prototype = Object.create(ParserBaseClass.prototype)
UserParser.prototype.constructor = UserParser
UserParser.prototype._attrDefs = userSchema

module.exports = UserParser
