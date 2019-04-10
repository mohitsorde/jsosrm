'use strict'

function getArrayDepth (arr) {
  let depth = 1
  let elem = arr[0]
  while (Array.isArray(elem)) {
    depth = depth + 1
    elem = elem[0]
  }
  return depth
}

module.exports = {
  getArrayDepth
}
