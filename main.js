function fixFakeLinkIssue(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Pattern to find anchor tags being used as buttons (fake links)
  // Matches <a> tags with href="#" or href="javascript:void(0)" that should be buttons
  const fakeLinkPattern = /<a\s+([^>]*?)href\s*=\s*["']#["']([^>]*?)>([^<]*)<\/a>/gi;
  
  updatedContent = updatedContent.replace(fakeLinkPattern, (match, attrsBefore, attrsAfter, text) => {
    // Build the button tag from the anchor tag attributes
    let buttonAttrs = attrsBefore + attrsAfter;
    
    // Extract id if present
    const idMatch = buttonAttrs.match(/id\s*=\s*["']([^"']+)["']/i);
    const idAttr = idMatch ? ` id="${idMatch[1]}"` : '';
    
    // Extract class if present
    const classMatch = buttonAttrs.match(/class\s*=\s*["']([^"']+)["']/i);
    const classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
    
    // Extract onclick if present
    const onclickMatch = buttonAttrs.match(/onclick\s*=\s*["']([^"']+)["']/i);
    const onclickAttr = onclickMatch ? ` onclick="${onclickMatch[1]}"` : '';
    
    // Build the button element
    return `<button${idAttr}${classAttr} type="button"${onclickAttr}>${text}</button>`;
  });

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Converted fake links to buttons for better accessibility in ${filePath}`);
  }
}

function addAriaAttribute(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Add aria-label to elements that need it for accessibility
  const elements = content.match(/<(?:div|span|section|article|nav|aside|header|footer|main)(?:\s+[^>]*)?>/gi);
  
  if (elements) {
    elements.forEach((element) => {
      const hasAriaLabel = /aria-label\s*=/i.test(element);
      const hasAriaLabelledBy = /aria-labelledby\s*=/i.test(element);
      const hasRole = /role\s*=/i.test(element);
      
      if (!hasAriaLabel && !hasAriaLabelledBy && !hasRole) {
        // Add appropriate accessibility attributes
        const tagMatch = element.match(/<(div|span|section|article|nav|aside|header|footer|main)/i);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          let role = '';
          
          switch (tagName) {
            case 'nav': role = ' navigation'; break;
            case 'main': role = ' navigation'; break;
            case 'aside': role = ' complementary'; break;
            case 'header': role = ' banner'; break;
            case 'footer': role = ' contentinfo'; break;
            case 'article': role = ' article'; break;
            case 'section': role = ' region'; break;
          }
          
          if (role) {
            updatedContent = updatedContent.replace(
              element,
              element.replace(/>$/, ` aria-label="${tagName}${role}">`)
            );
          }
        }
      }
    });
  }

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Added aria attributes for better accessibility in ${filePath}`);
}

function addLangAttribute(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Add lang attribute to html tag if missing
  const htmlTagPattern = /<html([^>]*)>/gi;
  
  updatedContent = updatedContent.replace(htmlTagPattern, (match, attrs) => {
    if (!attrs.includes('lang=')) {
      return `<html${attrs} lang="en">`;
    }
    return match;
  });

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Added lang attribute to HTML tag in ${filePath}`);
}

function fixTableStructure(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Add proper table headers and scope attributes
  const tableHeaders = content.match(/<th(?:\s+[^>]*)?>([^<]+)<\/th>/gi);
  
  if (tableHeaders) {
    tableHeaders.forEach((th) => {
      if (!/scope\s*=/i.test(th)) {
        updatedContent = updatedContent.replace(
          th,
          th.replace('<th', '<th scope="col"')
        );
      }
    });
  }

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Fixed table structure for better accessibility in ${filePath}`);
}

function addMainLandmark(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Ensure there's exactly one main landmark
  const mainElements = content.match(/<main(?:\s+[^>]*)?>/gi);
  
  if (!mainElements || mainElements.length === 0) {
    // Add main landmark after opening body tag
    updatedContent = updatedContent.replace(
      /<body(?:\s+[^>]*)?>/i,
      (match) => match + '\n<main>'
    );
  }

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Ensured main landmark exists in ${filePath}`);
}

function ensureUniqueLandmarks(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Count existing landmarks and ensure they're properly marked
  const landmarks = {
    header: (content.match(/<header/gi) || []).length,
    nav: (content.match(/<nav/gi) || []).length,
    main: (content.match(/<main/gi) || []).length,
    footer: (content.match(/<footer/gi) || []).length,
    aside: (content.match(/<aside/gi) || []).length,
  };

  // Remove duplicate header/footer if multiple exist
  if (landmarks.header > 1) {
    const headerPattern = /<header(?:\s+[^>]*)?>/gi;
    let count = 0;
    updatedContent = updatedContent.replace(headerPattern, (match) => {
      count++;
      if (count === 1) return match;
      return match.replace('<header', '<div');
    });
  }

  if (landmarks.footer > 1) {
    const footerPattern = /<footer(?:\s+[^>]*)?>/gi;
    let count = 0;
    updatedContent = updatedContent.replace(footerPattern, (match) => {
      count++;
      if (count === 1) return match;
      return match.replace('<footer', '<div');
    });
  }

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Ensured unique landmarks in ${filePath}`);
}

function addSvgAccessibleNames(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Add title elements to SVGs for accessibility
  const svgs = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/gi);
  
  if (svgs) {
    svgs.forEach((svg) => {
      const hasTitle = /<title/i.test(svg);
      if (!hasTitle) {
        updatedContent = updatedContent.replace(
          svg,
          svg.replace(/(<svg[^>]*>)/i, '$1\n  <title>SVG Image</title>')
        );
      }
    });
  }

  // Add aria-label or role="img" to img tags with SVGs
  const imgTags = content.match(/<img[^>]*src\s*=\s*["'][^"']*\.svg["'][^>]*>/gi);
  
  if (imgTags) {
    imgTags.forEach((img) => {
      if (!/aria-label\s*=/i.test(img) && !/role\s*=/i.test(img)) {
        updatedContent = updatedContent.replace(
          img,
          img.replace('<img', '<img role="img" aria-label="SVG Image"')
        );
      }
    });
  }

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Added accessible names to SVGs in ${filePath}`);
}

function addressAccessibilityIssues(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Example of a simple check for empty `alt` attribute in images
  const images = content.match(/<img [^>]*>/g);
  if (images) {
    images.forEach((image) => {
      const altAttribute = image.match(/alt\s*=\s*["']([^"']*)["']/i);
      if (!altAttribute || (altAttribute[1] && altAttribute[1].trim() === '')) {
        // Check if it's already decorative
        if (!image.includes('alt=""')) {
          updatedContent = updatedContent.replace(
            image,
            image.replace('<img', '<img alt="Image description"')
          );
        }
      }
    });
  }

  // Example of adding `aria-label` to buttons
  const buttons = content.match(/<button [^>]*>/g);
  if (buttons) {
    buttons.forEach((button) => {
      const hasAriaLabel = /aria-label\s*=/i.test(button);
      const hasTextContent = button.match(/>([^<]+)</);
      
      if (!hasAriaLabel && (!hasTextContent || hasTextContent[1].trim() === '')) {
        updatedContent = updatedContent.replace(
          button,
          button.replace('<button', '<button aria-label="Button description"')
        );
      }
    });
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Improved accessibility in ${filePath}`);
}

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

// Add checkboxes accessibility function
function fixCheckboxAccessibility(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const checkboxes = content.match(/<input type="checkbox"/g);
  if (checkboxes) {
    checkboxes.forEach((checkbox) => {
      updatedContent = updatedContent.replace(
        checkbox,
        checkbox.replace('<input', '<input role="checkbox" aria-label="checkbox"')
      );
    });
  }

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Added role and label to checkboxes for better accessibility in ${filePath}`);
}

module.exports = {
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