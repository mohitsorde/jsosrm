/**
 * Created By': Mohit Sorde
 * on': 27-Feb-2019
 * In any attribute definition, eith parser or (validators, setters) should be present
 * if parser is not present, then either validators or setters or both should be present
 *
 */
'use strict'
const UserAddressParser = require('../models/userAddress')
const PaymentDetailsParser = require('../models/paymentDetails')

module.exports = {
  'emailId': {
    'validators': [
      'maxChar_256',
      'emailId'
    ],
    'setters': [
      'htmlEncode',
      'toLower'
    ]
  },
  'firstName': {
    'validators': [
      'maxChar_64',
      'nameOnly'
    ],
    'setters': [
      'htmlEncode',
      'nameFormat'
    ]
  },
  'lastName': {
    'validators': [
      'maxChar_64',
      'nameOnly'
    ],
    'setters': [
      'htmlEncode',
      'nameFormat'
    ],
    'optional': true
  },
  'hobbies': [{
    'validators': ['aplhabetical'],
    'setters': ['toUpper'],
    'getters': ['asLower']
  }],
  'shippingAddress': {
    'parser': [UserAddressParser]
  },
  'paymentDetails': {
    'parser': [PaymentDetailsParser]
  }
}
