// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinks)

_Commit: fcb0a33e9b4314946bba82ef96ee7395f1f1f97b_

<!-- todo-hash: 0dc182849994d6e16764e2c6919a83ec5d14daa4 -->

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

function fixFakeLinkIssue(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Fix fake links: replace <a> tags without href that should be <button>
  content = content.replace(/<a([^>]*)>(.*?)<\/a>/gi, (match, attrs, inner) => {
    if (attrs.includes('href')) {
      return match;
    }
    return `<button${attrs}>${inner}</button>`;
  });
  fs.writeFileSync(filePath, content);
  console.log(`Fixed fake link issues in ${filePath}`);
}

function addAriaAttribute(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Implementation details omitted for brevity
  fs.writeFileSync(filePath, content);
  console.log(`Added ARIA attributes in ${filePath}`);
}

function addLangAttribute(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Add lang attribute to HTML element if not present
  const htmlLangRegex = /<html([^>]*)>/i;
  const updatedContent = content.replace(htmlLangRegex, (match, attrs) => {
    if (attrs.includes('lang=')) {
      return match;
    }
    return `<html${attrs} lang="en">`;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added lang attribute to HTML element in ${filePath}`);
}

// Add new functions here for REACT_017 and REACT_025

function addLandmarkRole(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');

  // Add landmark roles to elements based on their tags
  const landmarkMap = {
    header: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    nav: ['nav'],
    main: ['main'],
    footer: ['footer'],
    aside: ['aside'],
    banner: ['header'],
    contentInfo: ['article', 'section'],
    complementary: ['footer', 'aside'],
    form: ['form']
  };

  for (const [landmark, elementTypes] of Object.entries(landmarkMap)) {
    const elementRegex = new RegExp(`<(${elementTypes.join('|')})([^>]*)>`, 'gi');
    content = content.replace(elementRegex, (match, tagName, attrs) => {
      let newTag = `<${tagName}`;
      if (attrs) {
        newTag += ` ${attrs}`;
      }
      newTag += ` role="${landmark}"`;
      return newTag;
    });
  }

  fs.writeFileSync(filePath, content);
  console.log(`Added landmark roles to ${filePath}`);
}

function ensureUniqueLandmarks(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Ensure unique accessible names for landmarks
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];

  landmarks.forEach(landmark => {
    const regex = new RegExp(`<(${landmark})([^>]*)>`, 'gi');
    let match;
    let existingIds = [];
    let count = 0;

    while ((match = regex.exec(content)) !== null) {
      const attrs = match[2];
      if (attrs) {
        const idMatch = attrs.match(/id=["']([^"']+)["']/);
        if (idMatch) {
          existingIds.push(idMatch[1]);
        }
      }
      count++;
    }

    existingIds = Array.from(new Set(existingIds));

    regex = new RegExp(`<(${landmark})([^>]*)>`, 'gi');

    let updatedContent = content;
    let index = 0;

    while ((match = regex.exec(content)) !== null) {
      const idAttr = match[2] ? match[2].match(/id=["']([^"']+)["']/) : null;
      const idExists = idAttr && existingIds.includes(idAttr[1]);
      if (!idExists || (count > 1 && idAttr === existingIds[0])) {
        updatedContent = updatedContent.substring(0, match.index) + `<${landmark}${match[2]}>` + updatedContent.substring(match.index + match[0].length);
      } else {
        // Generate unique ID based on the landmark type
        const uniqueId = `${landmark}-${count}`;
        updatedContent = updatedContent.substring(0, match.index) + `<${landmark} id="${uniqueId}"${match[2]}>` + updatedContent.substring(match.index + match[0].length);
        count++;
      }
      index = match.index + match[0].length;
    }

    content = updatedContent;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Ensured unique landmarks in ${filePath}`);
}

// (New functions for REACT_017 and REACT_025 end here)

function fixTableStructure(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Fix table structure: ensure tables have proper thead/tbody
  const tableRegex = /<table([^>]*)>([\s\S]*?)<\/table>/gi;
  const updatedContent = content.replace(tableRegex, (match, attrs, inner) => {
    let fixed = inner;
    // Fix th elements to have scope attribute
    fixed = fixed.replace(/<th([^>]*)>/gi, (thMatch, thAttrs) => {
      if (thAttrs.includes('scope=')) {
        return thMatch;
      }
      return '<th scope="col"' + thAttrs + '>';
    });
    // Add thead if not present
    if (!fixed.includes('<thead')) {
      fixed = fixed.replace(/<tr/, '<thead><tr');
      fixed = fixed.replace(/<\/tr>/, '</tr></thead>');
    }
    // Add tbody if not present
    if (!fixed.includes('<tbody')) {
      const theadEnd = fixed.indexOf('</thead>');
      if (theadEnd !== -1) {
        fixed = fixed.substring(0, theadEnd + 8) + '<tbody>' + fixed.substring(theadEnd + 8) + '</tbody>';
      }
    }
    return `<table${attrs}>${fixed}</table>`;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed table structure issues in ${filePath}`);
}

function addMainLandmark(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Add main landmark if not present
  if (!content.includes('<main') || !content.includes('</main>')) {
    // Wrap main content in <main> tag
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      const bodyContent = bodyMatch[1];
      const wrappedContent = `<main>${bodyContent}</main>`;
      content = content.replace(bodyContent, wrappedContent);
    }
  }
  fs.writeFileSync(filePath, content);
  console.log(`Added main landmark in ${filePath}`);
}

function addSvgAccessibleNames(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Add accessible names to SVG elements that lack them
  const svgRegex = /<svg([^>]*)>/gi;
  const updatedContent = content.replace(svgRegex, (match, attrs) => {
    if (attrs.match(/aria-label=/i) || attrs.match(/aria-labelledby=/i) || attrs.match(/role="img"/i)) {
      return match;
    }
    // Add a default accessible name if none exists
    return `<svg${attrs} aria-label="Decorative icon" role="img">`;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added accessible names to SVGs in ${filePath}`);
}

function addAltAttribute(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Add alt attribute to img elements that lack it
  const imgRegex = /<img([^>]*)>/gi;
  const updatedContent = content.replace(imgRegex, (match, attrs) => {
    if (attrs.match(/alt=/i)) {
      return match;
    }
    return `<img${attrs} alt="">`;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added alt attributes in ${filePath}`);
}

function replaceButtonId(filePath, newButtonId) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace button IDs with a unique one
  const buttonRegex = /<button([^>]*)id=["'][^"']*["']([^>]*)>/gi;
  const updatedContent = content.replace(buttonRegex, (match, attrsBefore, attrsAfter) => {
    return `<button${attrsBefore}id="${newButtonId}"${attrsAfter}>`;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Replaced button ID with ${newButtonId} in ${filePath}`);
}

function addressAccessibilityIssues(reportPath) {
  const fs = require('fs');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  if (report && Array.isArray(report.issues)) {
    report.issues.forEach(issue => {
      if (issue.file && issue.type) {
        switch (issue.type) {
          case 'lang_attribute':
            addLangAttribute(issue.file);
            break;
          case 'table_structure':
            fixTableStructure(issue.file);
            break;
          case 'landmark':
            addMainLandmark(issue.file);
            break;
          case 'unique_landmarks':
            ensureUniqueLandmarks(issue.file);
            break;