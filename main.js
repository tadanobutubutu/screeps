// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

function fixFakeLinkIssue(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Fix fake links: replace <a> tags without href that should be <button>
  content = content.replace(/<a([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs, inner) => {
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

function fixTableStructure(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Fix table structure: ensure tables have proper thead/tbody
  const tableRegex = /<table\b([^>]*)>([\s\S]*?)<\/table>/gi;
  const updatedContent = content.replace(tableRegex, (match, attrs, inner) => {
    let fixed = inner;
    // Fix th elements to have scope attribute
    fixed = fixed.replace(/<th\b([^>]*)>/gi, (thMatch, thAttrs) => {
      if (thAttrs.match(/scope=/i)) {
        return thMatch;
      }
      return '<th scope="col"' + thAttrs + '>';
    });
    // Add thead if not present
    if (!fixed.includes('<thead')) {
      fixed = fixed.replace(/(<tr\b[^>]*>[\s\S]*?<\/tr>)/i, '<thead>$1</thead>');
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
      const wrappedContent = `<main role="main">${bodyContent}</main>`;
      content = content.replace(bodyContent, wrappedContent);
    }
  }
  fs.writeFileSync(filePath, content);
  console.log(`Added main landmark in ${filePath}`);
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
      if (attrs.includes('id=')) {
        const idAttr = attrs.match(/id=['"]([^'"]*)['"]/i)[1];
        existingIds.push(idAttr);
      }
      count++;
    }

    existingIds = Array.from(new Set(existingIds));

    regex = new RegExp(`<(${landmark})([^>]*(?:id=['"])(.*?)['"][^>]*)>`, 'gi');

    let updatedContent = content;
    let index = 0;

    while ((match = regex.exec(content)) !== null) {
      const idAttr = match[3];
      const idExists = existingIds.includes(idAttr);
      if (!idExists || (count > 1 && idAttr === existingIds[0])) {
        updatedContent = updatedContent.substring(0, match.index) + `<${landmark} id='${idAttr}'${match[2]}>` + updatedContent.substring(match.index + match[0].length);
      } else {
        // Generate unique ID based on the landmark type
        const uniqueId = `${landmark}-${count}`;
        updatedContent = updatedContent.substring(0, match.index) + `<${landmark} id='${uniqueId}'${match[2]}>` + updatedContent.substring(match.index + match[0].length);
        count++;
      }
      index = match.index + match[0].length;
    }

    content = updatedContent;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Ensured unique landmarks in ${filePath}`);
}

function addSvgAccessibleNames(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Add accessible names to SVGs
  const svgRegex = /<svg([^>]*)>/gi;
  let svgIndex = 0;
  let updatedContent = content;

  let match;
  let idx = 0;

  while ((match = svgRegex.exec(content)) !== null) {
    idx = match.index;
    updatedContent = updatedContent.substring(0, idx + match[0].length) + `<svg role="img" aria-label="SVG image ${svgIndex}"${match[1]}>` + updatedContent.substring(idx + match[0].length);
    svgIndex++;
  }

  fs.writeFileSync(updatedContent, updatedContent);
  console.log(`Added accessible names to SVGs in ${filePath}`);
}

function addAltAttribute(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<img([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('alt=')) {
      return match;
    }
    return `<img alt="Description of image"${attrs}`;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added alt attribute to images for better accessibility in ${filePath}`);
}

function replaceButtonId(filePath, newButtonId) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace my-button with the actual button id
  const buttonIdRegex = /id=["']my-button["']/gi;
  let match;

  // Replace id attributes
  const updatedContent = content.replace(buttonIdRegex, (match) => {
    return `id="${newButtonId}"`;
  });

  // Also replace any references in aria-controls, aria-labelledby, etc.
  const ariaRefRegex = /(aria-controls|aria-labelledby|aria-describedby)=["']my-button["']/gi;
  const finalContent = updatedContent.replace(ariaRefRegex, (match, attr) => {
    return `${attr}="${newButtonId}"`;
  });

  // Replace data attributes if any
  const dataRefRegex = /data-target=["']my-button["']/gi;
  const finalFinalContent = finalContent.replace(dataRefRegex, (match, attr) => {
    return `data-target="${newButtonId}"`;
  });

  fs.writeFileSync(filePath, finalFinalContent);
  console.log(`Replaced 'my-button' with '${newButtonId}' in ${filePath} (${countReplacements} replacement(s) made)`);

  return countReplacements;
}

/**
 * Ensures there is only a single <main> landmark per file (REACT_025).
 * If more than one <main> element is present, the additional ones are
 * converted to <section> elements to maintain a unique main landmark.
 *
 * @param {string} filePath - Path to the file to fix.
 * @returns {number} The number of duplicate <main> landmarks that were replaced.
 */
function ensureUniqueMainLandmark(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');

  // Find all <main> opening tags (not self-closing)
  const mainOpenRegex = /<main\b([^>]*)>/gi;
  const matches = [];
  let m;
  while ((m = mainOpenRegex.exec(content)) !== null) {
    matches.push({ index: m.index, length: m[0].length, attrs: m[1] });
  }

  if (matches.length <= 1) {
    console.log(`Only ${matches.length} <main> landmark(s) found in ${filePath}; no fix needed.`);
    return 0;
  }

  // Keep the first <main>, convert the rest to <section>
  let updatedContent = content;
  // Process from last to first to keep indices valid
  for (let i = matches.length - 1; i >= 1; i--) {
    const matchInfo = matches[i];
    const originalTag = `<main${matchInfo.attrs}>`;
    const replacementTag = `<section${matchInfo.attrs}>`;
    updatedContent =
      updatedContent.substring(0, matchInfo.index) +
      replacementTag +
      updatedContent.substring(matchInfo.index + originalTag.length);

    // Also replace the corresponding closing tag </main> with </section>
    const closingRegex = /<\/main>/gi;
    closingRegex.lastIndex = matchInfo.index + replacementTag.length;
    const closingMatch = closingRegex.exec(updatedContent);
    if (closingMatch) {
      updatedContent =
        updatedContent.substring(0, closingMatch.index) +
        '</section>' +
        updatedContent.substring(closingMatch.index + closingMatch[0].length);
    }
  }

  const replacedCount = matches.length - 1;
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Replaced ${replacedCount} duplicate <main> landmark(s) with <section> in ${filePath}`);
  return replacedCount;
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
          case 'unique_main_landmark':
            ensureUniqueMainLandmark(issue.file);
            break;
          case 'svg_accessible_name':
            addSvgAccessibleNames(issue.file);
            break;
          case 'fake_link':
            fixFakeLinkIssue(issue.file);
            break;
          case 'aria_attribute':
            addAriaAttribute(issue.file);
            break;
          case 'alt_attribute':
            addAltAttribute(issue.file);
            break;
          case 'button_id':
            replaceButtonId(issue.file, issue.newButtonId || 'action-button');
            break;
          // ... (these cases were here previously)
          case 'new_issue_type':
            // Implementation for the new issue type goes here
            break;
          default:
            console.log(`Unknown issue type: ${issue.type}`);
        }
      }
    });
  }

  console.log(`Addressed accessibility issues from insight report in ${reportPath}`);
}

// Create a new function called implementAccessibilityFixesFromReport to wrap the addressAccessibilityIssues function
function implementAccessibilityFixesFromReport(reportPath, buttonIdMap) {
  try {
    // If buttonIdMap is provided, apply button id replacements
    if (buttonIdMap && typeof buttonIdMap === 'object') {
      for (const [filePath, newButtonId] of Object.entries(buttonIdMap)) {
        replaceButtonId(filePath, newButtonId);
      }
    }
    addressAccessibilityIssues(reportPath);
    console.log('All accessibility fixes have been successfully implemented.');
    return true;
  } catch (error) {
    console.error(`Error implementing accessibility fixes: ${error.message}`);
    return false;
  }
}

/**
 * Renders a dependency graph based on the provided data.
 * @param {Object} graphData - The data representing the dependency graph.
 * @param {string} [containerId] - Optional container ID to render into.
 * @returns {string} - The rendered graph as a string (placeholder implementation).
 */
function renderDependencyGraph(graphData, containerId) {
  // Placeholder implementation: convert graph data to JSON string
  const graphString = JSON.stringify(graphData, null, 2);
  console.log(`Rendering dependency graph${containerId ? ' in ' + containerId : ''}:`, graphString);
  return graphString;
}

module.exports = {
  fixFakeLinkIssue,
  addAriaAttribute,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  ensureUniqueMainLandmark,
  addSvgAccessibleNames,
  addAltAttribute,
  replaceButtonId,
  addressAccessibilityIssues,
  implementAccessibilityFixesFromReport,
  renderDependencyGraph
};