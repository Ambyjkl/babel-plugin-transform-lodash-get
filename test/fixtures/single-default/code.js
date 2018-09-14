const get = require('lodash/get')

const obj = {
  b: null,
}

module.exports = [
  get(obj, 'a', []),
  get(obj, 'b', []),
]
