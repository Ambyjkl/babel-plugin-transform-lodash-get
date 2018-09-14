let _obj;

const get = require('lodash/get');

const obj = {
  a: ['123']
};
module.exports = [obj && (_obj = obj.a) && _obj[0] || null];