/* eslint-disable no-console */
const Benchmark = require('benchmark')
const get = require('lodash/get')

const suite = new Benchmark.Suite

const obj = { products: { foo: { items: [{ bar: { items: [{ foobar: 'abc' }] } }] } } }

suite.add('get array', () => {
  get(obj, ['products', 'foo', 'items', '0', 'baz', 'items', '0', 'foobar'], 'gg')
  get(obj, ['products', 'foo', 'items', '0', 'bar', 'items', '0', 'foobar'], 'gg')
})
  .add('get string', () => {
    get(obj, 'products.foo.items[0].baz.items[0].foobar', 'gg')
    get(obj, 'products.foo.items[0].bar.items[0].foobar', 'gg')
  })
  .add('transformed strict', () => {
    let _gg
    let _obj;
    (_gg = 'gg', obj && (_obj = obj.products) && (_obj = _obj.foo) && (_obj = _obj.items) && (_obj = _obj[0]) && (_obj = _obj.baz) && (_obj = _obj.items) && (_obj = _obj[0])) ? (_obj = _obj.foobar) === void 0 ? _gg : _obj : _gg;
    (_gg = 'gg', obj && (_obj = obj.products) && (_obj = _obj.foo) && (_obj = _obj.items) && (_obj = _obj[0]) && (_obj = _obj.bar) && (_obj = _obj.items) && (_obj = _obj[0])) ? (_obj = _obj.foobar) === void 0 ? _gg : _obj : _gg
  })
  .add('transformed loose', () => {
    let _obj;
    obj && (_obj = obj.products) && (_obj = _obj.foo) && (_obj = _obj.items) && (_obj = _obj[0]) && (_obj = _obj.baz) && (_obj = _obj.items) && (_obj = _obj[0]) && _obj.foobar || 'gg';
    obj && (_obj = obj.products) && (_obj = _obj.foo) && (_obj = _obj.items) && (_obj = _obj[0]) && (_obj = _obj.baz) && (_obj = _obj.items) && (_obj = _obj[0]) && _obj.foobar || 'gg'
  })
  .add('native no check (contol)', () => {
    obj.products.foo.items[0].bar.items[0].foobar
    obj.products.foo.items[0].bar.items[0].foobar
  })
  .add('native (caught)', () => {
    try {
      obj.products.foo.items[0].baz.items[0].foobar
    } catch (e) {/* */ }
    try {
      obj.products.foo.items[0].bar.items[0].foobar
    } catch (e) {/* */ }
  })
  .on('cycle', event => {
    console.log(String(event.target))
  })
  .on('complete', function () {
    const strict = this[2]
    const loose = this[3]

    const [s, l] = [0, 1, 4, 5].reduce((acc, i) => {
      const cur = this[i]
      const { hz, name } = cur;
      [strict, loose].forEach((item, j) => {
        acc[j].push((hz > item.hz ? `${((1 - item.hz / hz) * 100).toFixed(2)}% slower` : `${((item.hz / hz - 1) * 100).toFixed(2)}% faster`) + ` than ${name}`)
      })
      return acc
    }, [[], []])

    console.log(`
strict
------
${s.join('\n')}

loose
------
${l.join('\n')}
`)
  })
  .run()
