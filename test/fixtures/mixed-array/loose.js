let _obj;

const get = require('lodash/get');

const obj = {
  foo: {
    bar: [[123]]
  }
};

const fn = () => 'foo';

module.exports = [(_obj = obj) && (_obj = _obj[fn()]) && (_obj = _obj.bar) && (_obj = _obj[0]) && _obj[0]];