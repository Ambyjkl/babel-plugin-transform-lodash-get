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
const output = babel.transformSync(code, { plugins: [plugin] })
console.log(output.code)
