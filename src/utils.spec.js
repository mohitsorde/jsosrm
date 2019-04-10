'use strict'

const assert = require('chai').assert

const utils = require('./utils')

const getArrayDepth = utils.getArrayDepth

describe('utils testing', () => {
  describe('get array depth', () => {
    it('simple array', () => {
      let input = [2, 4, 5]
      assert.strictEqual(getArrayDepth(input), 1)
    })

    it('deep array', () => {
      let input = [
        [
          [
            [2, 4, 5],
            [2, 6, 7]
          ],
          [
            [2, 4]
          ]
        ],
        [
          [
            [4, 5],
            [6, 7]
          ],
          [
            [4]
          ]
        ]
      ]
      assert.strictEqual(getArrayDepth(input), 4)
    })

    it('deep array and first element is void', () => {
      let input = [
        [
          [
            [],
            [2, 6, 7]
          ],
          [
            [2, 4]
          ]
        ],
        [
          [
            [4, 5],
            [6, 7]
          ],
          [
            [4]
          ]
        ]
      ]
      assert.strictEqual(getArrayDepth(input), 4)
    })
  })
})
