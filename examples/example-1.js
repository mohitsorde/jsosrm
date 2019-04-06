'use strict'

const UserParser = require('./models/user')

let input = {
  'emailId': 'example1@domain.com',
  'firstName': 'exAmple. oNe',
  'lastName': 'teSt',
  'hobbies': ['tennis', 'cricket'],
  'shippingAddress': [
    {
      'lineOne': '#41, teSt SiTe',
      'city': 'Test. 1 ',
      'state': 'N.A.',
      'country': 'NA',
      'zipCode': '000XXX'
    }
  ],
  'paymentDetails': [{
    'cardNumber': '2222222222222222'
  }]
}

let parsedUser = new UserParser(input)
let output = parsedUser.getParams()
console.log('parsed input object => ', JSON.stringify(output))
/**
 * outputs:
 * {
 *      "emailId":"example1@domain.com",
 *      "firstName":"Example. One",
 *      "lastName":"Test",
 *      "shippingAddress":[
 *          {
 *              "lineOne":"#41, TEST SITE",
 *              "city":"TEST. 1 ",
 *              "state":"N.A.",
 *              "country":"NA",
 *              "zipCode":"000XXX"
 *          }
 *      ],
 *      "paymentDetails":[
 *          {
 *              "cardNumber":"2222222222222222"
 *          }
 *      ]
 * }
 */

let reverseParsedObj = parsedUser.getReverseParams()
console.log('reverse parsed object => ', JSON.stringify(reverseParsedObj))
/**
 * outputs:
 * {
 *      "emailId":"example1@domain.com",
 *      "firstName":"Example. One",
 *      "lastName":"Test",
 *      "shippingAddress":[{
 *          "lineOne":"#41, TEST SITE",
 *          "city":"TEST. 1 ",
 *          "state":"N.A.",
 *          "country":"NA",
 *          "zipCode":"000XXX"
 *      }],
 *      "paymentDetails":[{
 *          "cardNumber":"************2222"
 *      }]}
 */

module.exports = output
