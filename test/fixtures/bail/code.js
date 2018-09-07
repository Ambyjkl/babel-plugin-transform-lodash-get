const get = require('lodash/get')

const obj = {
  foo: 'bar',
}

const fn = () => 'foo'

module.exports = [
  get(obj, fn()),
]
