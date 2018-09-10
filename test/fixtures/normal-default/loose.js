let _obj2;

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
module.exports = [obj && (_obj = obj.a) && (_obj = _obj.b) && (_obj = _obj.c) && (_obj = _obj[0]) && _obj.d || null, obj && (_obj2 = obj.a) && (_obj2 = _obj2.c) && (_obj2 = _obj2.b) && (_obj2 = _obj2[0]) && _obj2.d || defVal];