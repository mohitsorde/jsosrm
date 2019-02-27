/**
 * Created By': Mohit Sorde
 * on': 27-Feb-2019
 * In any attribute definition, eith parser or (validators, setters) should be present
 * if parser is not present, then either validators or setters or both should be present
 *
 */
'use strict'

module.exports = {
  'cardNumber': {
    'validators': [
      'maxChar_16',
      'minChar_16',
      'wholeNumber'
    ],
    'getters': [
      'maskCardNumbers'
    ]
  }
}
