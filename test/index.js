const test = require('ava')
const plugin = require('../src')
const fs = require('fs')
const babel = require('@babel/core')

fs.readdirSync(__dirname + '/fixtures').forEach(each => {
  (each === 'empty-string' ? test : test)(each, async t => {
    const folder = `${__dirname}/fixtures/${each}`
    const codePath = `${folder}/code.js`
    const strictPath = `${folder}/strict.js`
    const loosePath = `${folder}/loose.js`
    const code = await new Promise((resolve, reject) => fs.readFile(codePath, 'utf8', (err, data) => err ? reject(err) : resolve(data)))
    const strict = await babel.transform(code, { plugins: [plugin] }).code
    const loose = await babel.transform(code, { plugins: [[plugin, { loose: true }]] }).code
    const expectedStrict = await new Promise((resolve, reject) => fs.readFile(strictPath, 'utf8', (err, data) => err ? reject(err) : resolve(data)))
    const expectedLoose = await new Promise((resolve, reject) => fs.readFile(loosePath, 'utf8', (err, data) => err ? reject(err) : resolve(data)))
    t.deepEqual(strict, expectedStrict)
    t.deepEqual(loose, expectedLoose)
    const codeEval = eval(code)
    const strictEval = eval(strict)
    t.deepEqual(strictEval, codeEval)
  })
})
