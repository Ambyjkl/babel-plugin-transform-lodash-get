const get = require('lodash/get')

const obj = {
  foo: {
    bar: [[123]],
  },
}

const fn = () => 'foo'

module.exports = [
  get(obj, [fn(), 'bar', 0, '0']),
]
