// Line 39: Implement a function to count dependencies
function countDependencies(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  
  const dependencies = {
    scripts: 0,
    styles: 0,
    images: 0,
    links: 0,
    total: 0
  };
  
  // Count script tags
  const scripts = content.match(/<script[^>]*>/g);
  dependencies.scripts = scripts ? scripts.length : 0;
  
  // Count stylesheet links
  const styles = content.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi);
  dependencies.styles = styles ? styles.length : 0;
  
  // Count images
  const images = content.match(/<img[^>]*>/gi);
  dependencies.images = images ? images.length : 0;
  
  // Count anchor links
  const links = content.match(/<a[^>]*href[^>]*>/gi);
  dependencies.links = links ? links.length : 0;
  
  // Calculate total
  dependencies.total = dependencies.scripts + dependencies.styles + dependencies.images + dependencies.links;
  
  return dependencies;
}

function fixFakeLinkIssue(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const anchors = content.match(/<a[^>]*id="unrotate"[^>]*>.*?<\/a>/gi);
  if (anchors) {
    anchors.forEach((anchor) => {
      updatedContent = updatedContent.replace(
        anchor,
        anchor.replace('<a ', '<button type="button" ').replace('</a>', '</button>')
      );
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed fake link issue in ${filePath}`);
}

function addAriaAttribute(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const inputs = content.match(/<input[^>]*type="checkbox"[^>]*>/gi);
  if (inputs) {
    inputs.forEach((input) => {
      if (!input.includes('aria-label')) {
        updatedContent = updatedContent.replace(
          input,
          input.replace('<input', '<input aria-label="checkbox"')
        );
      }
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added aria attributes in ${filePath}`);
}

function addLangAttribute(filePath) {
  const fs = require('fs');
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('lang=')) {
    content = content.replace('<html', '<html lang="en"');
    fs.writeFileSync(filePath, content);
    console.log(`Added lang attribute to ${filePath}`);
  }
}

function fixTableStructure(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const tables = content.match(/<table[^>]*>/gi);
  if (tables) {
    tables.forEach((table) => {
      if (!table.includes('role="table"')) {
        updatedContent = updatedContent.replace(
          table,
          table.replace('<table', '<table role="table"')
        );
      }
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed table structure in ${filePath}`);
}

function addMainLandmark(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const mains = content.match(/<main[^>]*>/gi);
  if (!mains) {
    const bodyMatch = content.match(/<body[^>]*>/);
    if (bodyMatch) {
      updatedContent = updatedContent.replace(
        bodyMatch[0],
        bodyMatch[0] + '\n<main>'
      );
    }
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added main landmark in ${filePath}`);
}

function ensureUniqueLandmarks(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  
  const landmarks = {
    header: (content.match(/<header[^>]*>/gi) || []).length,
    nav: (content.match(/<nav[^>]*>/gi) || []).length,
    main: (content.match(/<main[^>]*>/gi) || []).length,
    footer: (content.match(/<footer[^>]*>/gi) || []).length
  };

  console.log(`Landmark counts in ${filePath}:`, landmarks);
  return landmarks;
}

function addSvgAccessibleNames(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const svgs = content.match(/<svg[^>]*>/gi);
  if (svgs) {
    svgs.forEach((svg) => {
      if (!svg.includes('aria-label') && !svg.includes('aria-labelledby')) {
        updatedContent = updatedContent.replace(
          svg,
          svg.replace('<svg', '<svg aria-label="SVG icon"')
        );
      }
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added SVG accessible names in ${filePath}`);
}

function fixCheckboxAccessibility(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const checkboxes = content.match(/<input type="checkbox"/g);
  if (checkboxes) {
    checkboxes.forEach((checkbox) => {
      updatedContent = updatedContent.replace(
        checkbox,
        checkbox + ' role="checkbox" aria-label="checkbox"'
      );
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added role and label to checkboxes for better accessibility in ${filePath}`);
}

function addressAccessibilityIssues(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Example of a simple check for empty `alt` attribute in images
  const images = content.match(/<img [^>]*>/gi);
  if (images) {
    images.forEach((image) => {
      const altAttribute = image.match(/alt=["']([^"']*)["']/i);
      if (!altAttribute || altAttribute[1].trim() === '') {
        updatedContent = updatedContent.replace(
          image,
          image.replace('<img', '<img alt="Image description"')
        );
      }
    });
  }

  // Example of adding `aria-label` to buttons
  const buttons = content.match(/<button [^>]*>/gi);
  if (buttons) {
    buttons.forEach((button) => {
      if (!button.includes('aria-label')) {
        updatedContent = updatedContent.replace(
          button,
          button.replace('<button', '<button aria-label="Button description"')
        );
      }
    });
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Improved accessibility in ${filePath}`);
}

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

module.exports = {
  countDependencies,
  fixFakeLinkIssue,
  addAriaAttribute,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixCheckboxAccessibility,
  addressAccessibilityIssues,
  setLanguage,
};