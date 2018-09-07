const get = require('lodash/get')

const obj = {
  undefined: 1234,
}

module.exports = [
  get(),
  get(obj),
]
