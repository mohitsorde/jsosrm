/**
 * Created By': Mohit Sorde
 * on': 27-Feb-2019
 * In any attribute definition, eith parser or (validators, setters) should be present
 * if parser is not present, then either validators or setters or both should be present
 *
 */
'use strict'

module.exports = {
  'lineOne': {
    'validators': [
      'maxChar_512',
      'addressOnly'
    ],
    'setters': [
      'htmlEncode',
      'toUpper'
    ]
  },
  'lineTwo': {
    'validators': [
      'maxChar_512',
      'addressOnly'
    ],
    'setters': [
      'htmlEncode',
      'toUpper'
    ],
    'optional': true
  },
  'city': {
    'validators': [
      'maxChar_64',
      'addressOnly'
    ],
    'setters': [
      'htmlEncode',
      'toUpper'
    ]
  },
  'state': {
    'validators': [
      'maxChar_64',
      'addressOnly'
    ],
    'setters': [
      'htmlEncode',
      'toUpper'
    ]
  },
  'country': {
    'validators': [
      'maxChar_2',
      'minChar_2',
      'alphabetical'
    ],
    'setters': [
      'toUpper'
    ]
  },
  'zipCode': {
    'validators': [
      'maxChar_16',
      'alphaNumeric'
    ],
    'setters': [
      'toUpper'
    ]
  }
}
