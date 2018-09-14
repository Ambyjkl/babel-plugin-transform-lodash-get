# babel-plugin-transform-lodash-get
Babel plugin to statically optimize lodash/get

## Motivation
`lodash/get` is a quick and dirty way to follow a path in an object and avoid an `Uncaught TypeError: Cannot read property of undefined`, but it's quite inefficient because it does a lot of things at runtime which can usually be done at compile-time. This is especially true with the string version, which involves a regular expression evaluation to determine the path to take. Here are some benchmark results (see `misc/bench.js`) that demonstrate what this plugin accomplishes:

```
get array x 6,064,571 ops/sec ±0.64% (93 runs sampled)
get string x 1,757,073 ops/sec ±0.69% (91 runs sampled)
transformed strict x 112,676,455 ops/sec ±0.75% (92 runs sampled)
transformed loose x 213,763,702 ops/sec ±1.16% (89 runs sampled)
native no check (control) x 884,326,945 ops/sec ±0.39% (92 runs sampled)
native (caught) x 224,134 ops/sec ±0.84% (77 runs sampled)

strict
------
1757.95% faster than get array
6312.74% faster than get string
87.26% slower than native no check (control)
50171.86% faster than native (caught)

loose
------
3424.80% faster than get array
12065.90% faster than get string
75.83% slower than native no check (control)
95273.07% faster than native (caught)
```

You can run this benchmark on your own setup as follows:
```
npm run bench
```

## Example

### In
```javascript
get(obj, 'products.foo.items[0].baz.items[0].foobar', 'gg')
```

### Out
```javascript
let _gg;
let _obj;
(_gg = 'gg', obj && (_obj = obj.products) && (_obj = _obj.foo) && (_obj = _obj.items) && (_obj = _obj[0]) && (_obj = _obj.baz) && (_obj = _obj.items) && (_obj = _obj[0])) ? (_obj = _obj.foobar) === void 0 ? _gg : _obj : _gg;
```

## `loose` mode

The strict transformation (the default) generates code that always evaluates to exactly what `lodash/get` would produce, but if you favour better performance and smaller transformed code at the expense of sometimes getting a different falsy value than `undefined` when the key is not found in the object, then you can use the `loose` mode, that produces the following for the above example:

### Out
```javascript
let _obj;
obj && (_obj = obj.products) && (_obj = _obj.foo) && (_obj = _obj.items) && (_obj = _obj[0]) && (_obj = _obj.baz) && (_obj = _obj.items) && (_obj = _obj[0]) && _obj.foobar || 'gg';
```

## What it doesn't do
If the second argument of to a `lodash/get` call is not a string or an array but something else (like a variable, function call, object lookup), it cannot be statically optimized, obviously because this plugin cannot predict what would end up there at runtime. In these cases, the plugin would leave it as it is and move on to the next.

Also, this plugin doesn't (yet) remove unused imports/requires of `lodash` after transform from files; you may have to use other babel plugins to deal with this.

## Options
Apart from the aforementioned `loose` mode, this plugin also supports an additonal `patterns` option, which defaults to `["get", "_.get"]`, which lets you add custom patterns to match, but this is not recommended.

## Installation
### Via `pnpm`
```
pnpm i -D babel-plugin-transform-lodash-get
```
### Via `npm`
```
npm i -D babel-plugin-transform-lodash-get
```
### Via `yarn`
```
yarn add -D babel-plugin-transform-lodash-get
```

## Usage
### Via `.babelrc` (Recommended)
**.babelrc**
Without options
```json
{
  "plugins": ["transform-lodash-get"]
}
```
With options
```json
{
  "plugins": [["transform-lodash-get", { "loose": true, "patterns": ["foo", "_.foo"] }]]
}
```
### Via CLI
```
babel --plugins transform-lodash-get script.js
```

### Via Node API
```javascript
require("@babel/core").transform("code", {
  plugins: ["transform-lodash-get"]
});
```
