const templates = {
  // ... other templates ...

  'docs/dependency-graph.html': (content) => {
    return content.replace(/<th([^>]*?)>(.*?)<\/th>/g, (match, attrs, innerHTML) => {
      // Add scope="col" if not already specified
      const scopeAttr = attrs.match(/scope\s*=\s*["']?col["']?/i);
      const scopeStr = scopeAttr ? attrs : `${attrs} scope="col"`;
      return `<th${scopeStr}>${innerHTML}</th>`;
    });
  },
  // ... other templates ...
};

module.exports = templates;