let _obj2;

let _ref;

let _obj;

const get = require('lodash/get');

const obj = {
  a: {
    b: {
      c: [{
        d: 'e'
      }]
    }
  }
};
const defVal = '123';
module.exports = [(_ref = null, (_obj = obj) && (_obj = _obj.a) && (_obj = _obj.b) && (_obj = _obj.c) && (_obj = _obj[0])) ? (_obj = _obj.d) === void 0 ? _ref : _obj : _ref, (_obj2 = obj) && (_obj2 = _obj2.a) && (_obj2 = _obj2.c) && (_obj2 = _obj2.b) && (_obj2 = _obj2[0]) ? (_obj2 = _obj2.d) === void 0 ? defVal : _obj2 : defVal];