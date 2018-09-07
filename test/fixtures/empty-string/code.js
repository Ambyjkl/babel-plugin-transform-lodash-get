const get = require('lodash/get')

const obj = {
  '': 123,
}

module.exports = [
  get(obj, ''),
  get(obj, ['']),
  get(obj, Array('')),
  get(obj, new Array('')),
]
