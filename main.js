const fs = require('fs');

// Fix REACT_017: Add <main> landmarks to docs files
function applyLandmarkFixes() {
  const files = [
    {
      path: 'docs/dependency-graph.html',
      insertOpen: '<main>\n        <table id="table-rotated">',
      insertClose: '</table>\n    </main>'
    },
    {
      path: 'docs/index.html',
      insertOpen: '<main>\n        <div class="container">',
      insertClose: '</div>\n    </main>'
    }
  ];

  for (const file of files) {
    if (!fs.existsSync(file.path)) continue;
    let content = fs.readFileSync(file.path, 'utf8');

    if (file.path.includes('dependency-graph')) {
      if (!content.includes('<main>')) {
        content = content.replace('<table id="table-rotated">', file.insertOpen);
        content = content.replace('</table>', file.insertClose);
      }
    } else if (file.path.includes('index')) {
      if (!content.includes('<main>')) {
        content = content.replace('<div class="container">', file.insertOpen);
        content = content.replace('</div>\n</body>', '</div>\n    </main>\n</body>');
      }
    }

    fs.writeFileSync(file.path, content);
  }
}

applyLandmarkFixes();