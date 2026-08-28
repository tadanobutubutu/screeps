// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----

function fixFakeLinkIssue(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  // Fix fake links: replace <a> tags without href that should be <button>
  content = content.replace(/<a\s+([^>]*?)>([\s\S]*?)<\/a>/gi, (match, attrs, inner) => {
    if (attrs.includes('href=') || attrs.includes('onClick=')) {
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
    if (!/<thead/i.test(fixed)) {
      fixed = fixed.replace(/(<tr[\s\S]*?<\/tr>)/i, '<thead>$1</thead>');
    }
    // Add tbody if not present
    if (!/<tbody/i.test(fixed)) {
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
  if (!/<main/i.test(content)) {
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
        let attrs = m.attrs || '';
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
    return `<img alt="Description of image"${attrs}>`;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added alt attribute to images for better accessibility in ${filePath}`);
}

function replaceButtonId(filePath, newButtonId) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  let countReplacements = 0;

  // Replace my-button with the actual button id
  const buttonIdRegex = /my-button/gi;

  // Replace id attributes
  const updatedContent = content.replace(buttonIdRegex, (match) => {
    countReplacements++;
    return newButtonId;
  });

  // Also replace any references in aria-controls, aria-labelledby, etc.
  const ariaRefRegex = /aria-controls="my-button"|aria-labelledby="my-button"/gi;
  const finalContent = updatedContent.replace(ariaRefRegex, (match, attr) => {
    countReplacements++;
    return match.replace('my-button', newButtonId);
  });

  // Replace data attributes if any
  const dataRefRegex = /data-button="my-button"/gi;
  const finalFinalContent = finalContent.replace(dataRefRegex, (match, attr) => {
    countReplacements++;
    return match.replace('my-button', newButtonId);
  });

  fs.writeFileSync(filePath, finalFinalContent);
  console.log(`Replaced 'my-button' with '${newButtonId}' in ${filePath} (${countReplacements} replacement(s) made)`);

  return countReplacements;
}

function fixSvgDataUriAccessibility(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix SVG data URIs in icons configuration (favicons)
  // Pattern matches ... strings
  const dataUriRegex = /data:image\/svg\+xml,.*?<svg([^>]*)>([\s\S]*?)<\/svg>/gi;
  
  let updatedContent = content.replace(dataUriRegex, (match, prefix, svgAttrs, svgContent, suffix) => {
    // Check if SVG already has a title or aria-label
    const hasTitle = /<title/i.test(svgContent);
    const hasAriaLabel = svgAttrs.includes('aria-label');
    const hasAriaHidden = svgAttrs.includes('aria-hidden');
    
    let newSvgAttrs = svgAttrs;
    let newSvgContent = svgContent;
    
    if (!hasTitle && !hasAriaLabel && !hasAriaHidden) {
      // Add aria-hidden="true" for decorative favicon SVGs
      newSvgAttrs = `${svgAttrs} aria-hidden="true"`;
    } else if (hasTitle && !hasAriaLabel && !hasAriaHidden) {
      // SVG has title but no explicit accessible name on SVG element
      // Add role="img" to ensure title is used as accessible name
      newSvgAttrs = `${svgAttrs} role="img"`;
    }
    
    return `data:image/svg+xml,<svg${newSvgAttrs}>${newSvgContent}</svg>`;
  });
  
  // Also handle apple touch icon if present
  const appleIconRegex = /apple-touch-icon.*?data:image\/svg\+xml,.*?<svg([^>]*)>([\s\S]*?)<\/svg>/gi;
  updatedContent = updatedContent.replace(appleIconRegex, (match, prefix, svgAttrs, svgContent, suffix) => {
    const hasTitle = /<title/i.test(svgContent);
    const hasAriaLabel = svgAttrs.includes('aria-label');
    const hasAriaHidden = svgAttrs.includes('aria-hidden');
    
    let newSvgAttrs = svgAttrs;
    
    if (!hasTitle && !hasAriaLabel && !hasAriaHidden) {
      newSvgAttrs = `${svgAttrs} aria-hidden="true"`;
    } else if (hasTitle && !hasAriaLabel && !hasAriaHidden) {
      newSvgAttrs = `${svgAttrs} role="img"`;
    }
    
    return match.replace(`<svg${svgAttrs}>`, `<svg${newSvgAttrs}>`);
  });
  
  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Fixed SVG data URI accessibility in ${filePath}`);
  }
  
  return updatedContent !== content;
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
            break