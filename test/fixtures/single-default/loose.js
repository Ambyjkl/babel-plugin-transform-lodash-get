const get = require('lodash/get');

const obj = {
  b: null
};
module.exports = [obj && obj.a || [], obj && obj.b || []];