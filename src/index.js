const stringToPath = require('lodash/_stringToPath')

function plugin({ types: t }) {
  const undef = () => t.unaryExpression('void', t.numericLiteral(0))

  function deref(obj, key) {
    let number
    let value
    let computed = true

    const prop = t.isIdentifier(key)
      ? key
      : (value = key.value, t.isStringLiteral(key)
        ? ((number = Number(value)), Number.isNaN(number))
          ? (computed = false, t.identifier(value))
          : t.numericLiteral(number)
        : t.numericLiteral(value))
    return t.memberExpression(obj, prop, computed)
  }

  return {
    visitor: {
      CallExpression(path) {
        const {node} = path
        const {callee, arguments: args} = node

        if (
          (t.isMemberExpression(callee) &&
            callee.object.name === '_' &&
            callee.property.name === 'get') ||
          (t.isIdentifier(callee) && callee.name === 'get')
        ) {
          const _0 = args[0]
          const _1 = args[1]
          const _2 = args[2]
          if (!_0) {
            return
          }
          let nodes = null
          if (t.isArrayExpression(_1)) {
            nodes = _1.elements
          } else if ((t.isCallExpression(_1) || t.isNewExpression(_1)) && _1.callee.name === 'Array') {
            nodes = _1.arguments
          } else if (t.isStringLiteral(_1)) {
            nodes = stringToPath(_1.value).map(a => t.stringLiteral(a))
          } else { // cannot be statically optimized
            return
          }
          if (nodes.length === 0) {
            path.replaceWith(undef())
          } else if (nodes.length === 1) {
            const transformed = t.conditionalExpression(_0, deref(_0, nodes[0]), _2 || undef())
            path.replaceWith(transformed)
          } else {
            const tmpId = path.scope.generateUidIdentifierBasedOnNode(_0)
            const def = t.variableDeclaration('let', [t.variableDeclarator(tmpId)])
            let scopeBlock = path.scope.block
            while (scopeBlock.constructor !== Array) {
              scopeBlock = scopeBlock.body
            }
            scopeBlock.unshift(def)
            t.logicalExpression('&&', t.identifier('a'), t.identifier('b'))
            let i = nodes.length - 2
            let right = t.assignmentExpression('=', tmpId, deref(tmpId, nodes[i]))
            i--;
            for (; i >= 0; i--) {
              const left = t.assignmentExpression('=', tmpId, deref(tmpId, nodes[i]))
              right = t.logicalExpression('&&', left, right)
            }
            const test = t.logicalExpression('&&', t.assignmentExpression('=', tmpId, _0), right)
            const lastDeref = deref(tmpId, nodes[nodes.length - 1])
            const consequent = _2
              ? t.conditionalExpression(t.binaryExpression('===', t.assignmentExpression('=', tmpId, lastDeref), undef()), _2, tmpId)
              : lastDeref
            const alternate = _2 || undef()
            path.replaceWith(t.conditionalExpression(test, consequent, alternate))
          }
        }
      }
    }
  }
}

module.exports = plugin
