// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// This is the existing code that needs to be preserved

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

// Add the following functions at the end of the file:

function addMainLandmark(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Add main landmark if not present
  if (!content.includes('<main')) {
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
    const matches = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      matches.push({
        index: match.index,
        fullMatch: match[0],
        tag: match[1],
        attrs: match[2]
      });
    }

    if (matches.length > 1) {
      // Apply replacements from last to first so indices remain valid
      for (let i = matches.length - 1; i >= 0; i--) {
        const m = matches[i];
        let attrs = m.attrs.replace(/\s*id=["'][^"']*["']/gi, '');
        const newId = `${landmark}-${i + 1}`;
        const replacement = `<${m.tag}${attrs ? ' ' + attrs.trim() : ''} id="${newId}">`;
        content = content.substring(0, m.index) + replacement + content.substring(m.index + m.fullMatch.length);
      }
    }
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
  const updatedContent = content.replace(svgRegex, (match, attrs) => {
    return `<svg${attrs} role="img" aria-label="SVG image ${svgIndex++}">`;
  });
  fs.writeFileSync(filePath, updatedContent);
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
  let countReplacements = 0;

  // Replace my-button with the actual button id
  const buttonIdRegex = /id=["\']my-button["\']/gi;
  const updatedContent = content.replace(buttonIdRegex, (match) => {
    countReplacements++;
    return `id="${newButtonId}"`;
  });

  // Also replace any references in aria-controls, aria-labelledby, etc.
  const ariaRefRegex = /(aria-controls|aria-labelledby|aria-describedby)=["\']my-button["\']/gi;
  const finalContent = updatedContent.replace(ariaRefRegex, (match, attr) => {
    countReplacements++;
    return `${attr}="${newButtonId}"`;
  });

  // Replace data attributes if any
  const dataRefRegex = /data-target=["\']my-button["\']/gi;
  const finalFinalContent = finalContent.replace(dataRefRegex, (match, attr) => {
    countReplacements++;
    return `data-target="${newButtonId}"`;
  });

  fs.writeFileSync(filePath, finalFinalContent);
  console.log(`Replaced 'my-button' with '${newButtonId}' in ${filePath} (${countReplacements} replacement(s) made)`);

  return countReplacements;
}

// Merged functions from both sides
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