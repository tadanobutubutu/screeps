/*
Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?
*/

const fs = require('fs');

// Fix REACT_027: add scope="col" to <th> elements that lack a scope attribute
const htmlPath = 'docs/dependency-graph.html';
try {
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(/<th\b([^>]*)>/gi, (match, attrs) => {
    if (/\bscope\b/i.test(attrs)) {
      return match;
    }
    return `<th scope="col"${attrs}>`;
  });
  fs.writeFileSync(htmlPath, html);
} catch (e) {
  // Skip if the HTML file is not present
}