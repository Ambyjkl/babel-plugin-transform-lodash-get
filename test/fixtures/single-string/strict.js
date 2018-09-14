const _ = require('lodash');

const {
  get
} = _;
const obj = {
  a: 1,
  b: 2
};
module.exports = [obj ? obj.a : void 0, obj ? obj.b : 3];