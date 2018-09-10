const castPath = require('lodash/_castPath')

function plugin({ types: t }) {
  const undef = () => t.unaryExpression('void', t.numericLiteral(0))

  function deref(obj, key) {
    let number
    let value
    let computed = true

    const prop = t.isStringLiteral(key)
      ? (value = key.value, value === ''
        ? key
        : (number = +value, Number.isNaN(number)))
          ? t.isValidIdentifier(value)
            ? (computed = false, t.identifier(value))
            : key
          : t.numericLiteral(number)
      : key
    return t.memberExpression(obj, prop, computed)
  }

  return {
    pre() {
      this.functions = []
      this.methods = []

      const patterns = this.opts.patterns || ['get', '_.get']

      for (const pattern of patterns) {
        const dot = pattern.indexOf('.')
        if (dot === -1) {
          this.functions.push(pattern)
        } else {
          this.methods.push([pattern.slice(0, dot), pattern.slice(dot + 1)])
        }
      }
    },
    visitor: {
      CallExpression(path) {
        const { node } = path
        const { callee } = node
        const loose = !!this.opts.loose

        if (
          (t.isMemberExpression(callee) && this.methods.some(([obj, method]) =>
              callee.object.name === obj &&
              callee.property.name === method)) ||
          (t.isIdentifier(callee) && this.functions.includes(callee.name))
        ) {
          const args = node.arguments
          const _0 = args[0]
          const _1 = args[1]
          const _2 = args[2]

          if (!_0) {
            path.replaceWith(undef())
            return
          }
          let nodes
          if (t.isStringLiteral(_1)) {
            nodes = castPath(_1.value).map(a => t.stringLiteral(a))
          } else if (t.isArrayExpression(_1)) {
            nodes = _1.elements
          } else if ((t.isCallExpression(_1) || t.isNewExpression(_1)) && _1.callee.name === 'Array') {
            nodes = _1.arguments
          } else {
            if (_1 === undefined) {
              const undefId = t.identifier('undefined')
              if (loose) {
                path.replaceWith(t.logicalExpression('&&', _0, t.memberExpression(_0, undefId)))
              } else {
                path.replaceWith(t.conditionalExpression(_0, t.memberExpression(_0, undefId), undef()))
              }
            }
            // cannot be statically optimized
            return
          }

          if (nodes.length === 0) {
            path.replaceWith(undef())
          } else if (nodes.length === 1) {
            const dereffed = deref(_0, nodes[0])
            if (loose) {
              path.replaceWith(t.logicalExpression('&&', _0, dereffed))
            } else {
              path.replaceWith(t.conditionalExpression(_0, dereffed, _2 || undef()))
            }
          } else {
            const { scope } = path
            const tmpId = scope.generateUidIdentifierBasedOnNode(_0)
            const def = t.variableDeclaration('let', [t.variableDeclarator(tmpId)])
            let scopeBlock = scope.block
            while (scopeBlock.constructor !== Array) {
              scopeBlock = scopeBlock.body
            }
            scopeBlock.unshift(def)
            t.logicalExpression('&&', t.identifier('a'), t.identifier('b'))
            let i = nodes.length - 2
            let right = t.assignmentExpression('=', tmpId, deref(tmpId, nodes[i]))
            i--
            for (; i >= 1; i--) {
              const left = t.assignmentExpression('=', tmpId, deref(tmpId, nodes[i]))
              right = t.logicalExpression('&&', left, right)
            }
            right = t.logicalExpression('&&', t.assignmentExpression('=', tmpId, deref(_0, nodes[i])), right)
            let transformed;
            const left = t.logicalExpression('&&', _0, right)
            const lastDeref = deref(tmpId, nodes[nodes.length - 1])
            if (loose) {
              const full = t.logicalExpression('&&', left, lastDeref)
              transformed = _2
                ? t.logicalExpression('||', full, _2)
                : full
            } else {
              if (_2) {
                let consequent
                let alternate
                let test
                const undefCheck = t.binaryExpression('===', t.assignmentExpression('=', tmpId, lastDeref), undef())
                if (t.isIdentifier(_2)) {
                  test = left
                  consequent = t.conditionalExpression(undefCheck, _2, tmpId)
                  alternate = _2
                } else {
                  alternate = scope.generateUidIdentifierBasedOnNode(_2)
                  const defaultVarDec = t.variableDeclaration('let', [t.variableDeclarator(alternate)])
                  scopeBlock.unshift(defaultVarDec)
                  test = t.sequenceExpression([t.assignmentExpression('=', alternate, _2), left])
                  consequent = t.conditionalExpression(undefCheck, alternate, tmpId)
                }
                transformed = t.conditionalExpression(test, consequent, alternate)
              } else {
                transformed = t.conditionalExpression(left, lastDeref, undef())
              }
            }
            path.replaceWith(transformed)
          }
        }
      }
    }
  }
}

module.exports = plugin
