const get = require('lodash/get');

const obj = {
  undefined: 1234
};
module.exports = [void 0, obj ? obj.undefined : void 0];