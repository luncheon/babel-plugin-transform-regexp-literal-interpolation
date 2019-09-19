module.exports = () => ({
  visitor: {
    RegExpLiteral(path) {
      path.node.pattern = path.node.pattern.replace(/\[\$\$(.+?)\]/g, (_, name) => {
        const binding = path.scope.bindings[name]
        if (!binding) {
          throw path.buildCodeFrameError(`'${name}' is not found.`, ReferenceError)
        }
        if (binding.kind !== 'const') {
          throw path.buildCodeFrameError(`'${name}' is not constant.`, ReferenceError)
        }
        if (!binding.path.isVariableDeclarator()) {
          throw path.buildCodeFrameError(`'${name}' is not declared.`, ReferenceError)
        }
        const init = binding.path.node.init
        if (!init) {
          throw path.buildCodeFrameError(`'${name}' is not initialized on declaration.`, ReferenceError)
        }
        if (init.type !== 'RegExpLiteral') {
          throw path.buildCodeFrameError(`'${name}' is not a RegExp literal.`, ReferenceError)
        }
        if (init === path.node) {
          throw path.buildCodeFrameError(`'${name}' is referenced by itself.`, ReferenceError)
        }
        if (init.start > path.node.start) {
          throw path.buildCodeFrameError(`'${name}' is used before declaration.`, ReferenceError)
        }
        return init.pattern
      })
    }
  }
})
