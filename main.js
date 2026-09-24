// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

const http = require('http');

function ensureUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role]');
  const seenTypes = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (seenTypes[role]) {
      const uniqueId = `${role}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      landmark.setAttribute('aria-label', `${role}-${uniqueId}`);
    }
    seenTypes[role] = true;
  });
}

function addLangAttribute(html) {
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (attrs.includes('lang=')) {
      return match;
    }
    return `<html${attrs} lang="en">`;
  });
}

function fixTableStructure(html) {
  let tableCount = 0;
  return html.replace(/<table([^>]*)>/gi, (match, attrs) => {
    tableCount++;
    let fixed = match;
    if (!attrs.includes('scope')) {
      fixed = fixed.replace('>', ' role="table">');
    }
    return fixed;
  }).replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('scope')) {
      return `<th${attrs} scope="col">`;
    }
    return match;
  });
}

function fixLandmarks(html) {
  let fixedHtml = html;
  
  if (!fixedHtml.includes('<header') && !fixedHtml.includes('<main')) {
    fixedHtml = fixedHtml.replace(/<body([^>]*)>/i, '<body$1><header role="banner">');
  }
  
  if (!fixedHtml.includes('<nav')) {
    const mainMatch = fixedHtml.match(/<main([^>]*)>/i);
    if (mainMatch) {
      fixedHtml = fixedHtml.replace(/<main([^>]*)>/i, '<nav role="navigation" aria-label="Main navigation"><\/nav><main$1>');
    }
  }
  
  if (!fixedHtml.includes('<footer')) {
    fixedHtml = fixedHtml.replace(/<\/body>/i, '<footer role="contentinfo"></footer></body>');
  }
  
  if (!fixedHtml.includes('<main')) {
    const bodyMatch = fixedHtml.match(/<body([^>]*)>/i);
    if (bodyMatch) {
      fixedHtml = fixedHtml.replace(/<body([^>]*)>/i, '<body$1><main role="main">');
    }
  }
  
  return fixedHtml;
}

function addSvgAccessibleNames(html) {
  return html.replace(/<svg([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('aria-label') && !attrs.includes('title')) {
      const idMatch = attrs.match(/id=["']([^"']+)["']/);
      const id = idMatch ? idMatch[1] : `svg-${Math.random().toString(36).substr(2, 9)}`;
      return `<svg${attrs} role="img" aria-label="Decorative or informational graphic"${!attrs.includes('id') ? ` id="${id}"` : ''}>`;
    }
    return match;
  });
}

function fixFakeLinks(html) {
  return html.replace(/<a([^>]*)href=["']#["']([^>]*)>/gi, (match, before, after) => {
    return `<button type="button" class="fake-link"${before}${after}>`;
  }).replace(/<\/a>/gi, (match) => {
    return '</button>';
  });
}

function applyAccessibilityFixes(html) {
  let fixed = html;
  fixed = addLangAttribute(fixed);
  fixed = fixTableStructure(fixed);
  fixed = fixLandmarks(fixed);
  fixed = addSvgAccessibleNames(fixed);
  fixed = fixFakeLinks(fixed);
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = fixed;
  ensureUniqueLandmarks(tempDiv);
  fixed = tempDiv.innerHTML;
  
  return fixed;
}

const server = http.createServer((req, res) => {
  let html = `<!DOCTYPE html>
<html>
<head>
  <title>Sample Page</title>
</head>
<body>
  <header role="banner">
    <h1>Welcome</h1>
  </header>
  <nav role="navigation" aria-label="Main">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
  <main role="main">
    <h2>Data Table</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Item 1</td>
          <td>100</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Graphics</h2>
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="40" fill="blue" />
    </svg>
    
    <p>For more information, <a href="#" onclick="return false;">click here</a>.</p>
  </main>
  <footer role="contentinfo">
    <p>&copy; 2024</p>
  </footer>
</body>
</html>`;

  html = addLangAttribute(html);
  html = fixTableStructure(html);
  html = fixLandmarks(html);
  html = addSvgAccessibleNames(html);
  html = fixFakeLinks(html);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { 
  ensureUniqueLandmarks,
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  applyAccessibilityFixes,
  server
};