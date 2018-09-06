/* eslint-disable no-console */
const babel = require('@babel/core')
const plugin = require('../src')

const code = `
get(obj, 'data.project.items[0].workspace.items[0].channel', '12345');
!function () {
  {
    _.get(obj,['data','project','items','0','workspac','items',0,'channel'], '12345')
  }
  _.get(obj,['123'], '12345');
  _.get(obj,[abc], '12345');
  a(_.get(obj,['data', 0], '12345'));
}()`
const standard = babel.transformSync(code, { plugins: [plugin] }).code
const loose = babel.transformSync(code, { plugins: [[plugin, { loose: true }]] }).code
console.log('Standard\n-------\n', standard, '\n\n\nLoose\n-----\n', loose)
