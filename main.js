// Fix for REACT_027: Add scope attributes to <th> elements in docs/dependency-graph.html
const fs = require('fs');
const cheerio = require('cheerio');

const filePath = 'docs/dependency-graph.html';
const html = fs.readFileSync(filePath, 'utf8');
const $ = cheerio.load(html);

// Add scope="col" to every <th> that does not already have a scope attribute
$('th').each((i, el) => {
  if (!$(el).attr('scope')) {
    $(el).attr('scope', 'col');
  }
});

fs.writeFileSync(filePath, $.html());