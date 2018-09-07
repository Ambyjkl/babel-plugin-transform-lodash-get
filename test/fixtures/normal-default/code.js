const get = require('lodash/get')

const obj = {
  a: {
    b: {
      c: [
        {
          d: 'e'
        }
      ]
    }
  }
}

const defVal = '123'

module.exports = [
  get(obj, 'a.b.c[0].d', null),
  get(obj, 'a.c.b[0].d', defVal),
]
