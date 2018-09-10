const get = require('lodash/get')

const obj = {
  a: ['123'],
}

module.exports = [
  get(obj, 'a[0]', null),
]
