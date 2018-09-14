let _obj, _2;

const _ = require('lodash');

const {
  get
} = _;
const obj = {
  a: 1,
  b: 2
};
module.exports = [obj ? obj.a : void 0, (_2 = 3, obj) ? (_obj = obj.b) === void 0 ? _2 : _obj : _2];