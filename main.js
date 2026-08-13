// Rule configuration
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing'
    },
    fixable: 'code'
  },
  create(context) {
    return {
      Program(node) {
        // Check for unexpected tokens at the start
        const sourceCode = context.getSourceCode();
        const tokens = sourceCode.tokens;
        
        if (tokens.length > 0 && !tokens[0].value.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
          context.report({
            node,
            message: 'Unexpected token at line 1'
          });
        }
      }
    };
  }
};