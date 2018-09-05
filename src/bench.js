/* eslint-disable no-console */
const Benchmark = require('benchmark')
const get = require('lodash/get')

var suite = new Benchmark.Suite; 

const obj = {data:{project:{items:[{workspace:{items:[{channel: 'abc'}]}}]}}};
// add tests
suite.add('get array', () => {
  get(obj, ['data','project','items','0','workspac','items','0','channel'], 'gg')
  get(obj, ['data','project','items','0','workspace','items','0','channel'], 'gg')
})
.add('get string', () => {
  get(obj, 'data.project.items[0].workspac.items[0].channel', 'gg')
  get(obj, 'data.project.items[0].workspace.items[0].channel', 'gg')
})
.add('native &&ed cached', () => {
    var defaultVal = 'gg'
    var n;
    ((n = obj) && (n = n.data) && (n = n.project) && (n = n.items) && (n = n[0]) && (n = n.workspac) && (n = n.items) && (n = n[0])) ? ((n = n.channel) === undefined ? defaultVal : n) : defaultVal;
    ((n = obj) && (n = n.data) && (n = n.project) && (n = n.items) && (n = n[0]) && (n = n.workspace) && (n = n.items) && (n = n[0])) ? ((n = n.channel) === undefined ? defaultVal : n) : defaultVal
})
.add('native &&ed loose (not implemented yet)', () => {
    var defaultVal = 'gg'
    var n;
    (n = obj) && (n = n.data) && (n = n.project) && (n = n.items) && (n = n[0]) && (n = n.workspac) && (n = n.items) && (n = n[0]) && n.channel || defaultVal;
    (n = obj) && (n = n.data) && (n = n.project) && (n = n.items) && (n = n[0]) && (n = n.workspace) && (n = n.items) && (n = n[0]) && n.channel || defaultVal
})
.add('native (no check)', () => {
    obj.data.project.items[0].workspace.items[0].channel
    obj.data.project.items[0].workspace.items[0].channel
})
.add('native (caught)', () => {
    try {
        obj.data.project.items[0].workspac.items[0].channel
    } catch (e) {/* */}
    try {
        obj.data.project.items[0].workspace.items[0].channel
    } catch (e) {/* */}
})
// add listeners
.on('cycle', event => {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run();

/*
get(a, ['b'], c) => a ? a.b : c
obj ? obj.key : undefined
obj ? obj.key : def

var n = obj;
(n && (n = n.key1)) ? n.key2 : undefined
(n && (n = n.key1)) ? ((n = n.key2) === undefined ? def : n) : def
*/
