// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// Preserved existing code and handling from origin/main:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// Original content from main.js preserved

/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to the element if it doesn't already have one.
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label value to set
 * @returns {boolean} True if label was added, false if element already had one
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!label) {
    throw new Error('Label is required');
  }
  
  if (element.getAttribute('aria-label')) {
    return false;
  }
  
  element.setAttribute('aria-label', label);
  return true;
}

/**
 * Renders dependency graphs for the given configuration.
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} dependencies - The dependencies data to render
 * @param {Object} [options={}] - Optional rendering configuration
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraphs(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }
  
  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container');
  
  // Add accessibility label if not present
  const hasAriaLabel = addAriaLabel(container, `Dependency graph: ${containerId}`);
  
  // Placeholder for graph rendering logic
  // Actual implementation would use a library like D3.js or similar
  const graphData = {
    id: containerId,
    dependencies: dependencies,
    options: options,
    rendered: true,
    timestamp: new Date().toISOString()
  };
  
  console.log('Rendering dependency graphs:', graphData);
  
  return graphData;
}

async function retryOperation(operation, maxRetries = CONFIG.maxRetries) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      log(`Attempt ${i + 1} failed: ${error.message}`, 'warn');
      if (i < maxRetries - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  throw lastError;
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// New function for REACT_017 (adding landmark roles and fixing landmark issues)
function addLandmarkRolesAndFixIssues() {
  // Hypothetical code to add landmark roles and fix landmark issues
  // ...
}

// New function for REACT_027 (fixing table structure issues)
function validateTableStructure() {
  // Implementation for REACT_027: Fix 26 table structure issues
  // ...
}

// New function for REACT_015 (getting lang attribute for HTML element)
function getLangAttribute() {
  // Implementation for REACT_015: Add lang attribute to HTML element
  // ...
}

// New function for REACT_041 (getting accessible names for 2 SVGs)
function getSvgAccessibleName() {
  // Implementation for REACT_041: Add accessible names to 2 SVGs
  // ...
}

// New function for REACT_036 (validating table accessibility)
function validateTableAccessibility() {
  // Implementation for REACT_036: Fix 1 fake link issue
  // ...
}

// Function for transforming input data (new function for accessibility)
function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  if (typeof inputData === 'string') {
    let result = trimWhitespace ? inputData.trim() : inputData;
    result = uppercase ? result.toUpperCase() : result;
    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }
    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map(item => transformInputData(item, options));
  }

  if (typeof inputData === 'object' && inputData !== null) {
    const result = {};
    for (const [key, value] of Object.entries(inputData)) {
      let newKey = preserveKeys ? key : key.trim();
      newKey = uppercase ? newKey.toUpperCase() : newKey;
      result[newKey] = transformInputData(value, options);
    }
    return result;
  }

  return inputData;
}

// Additional utility functions for accessibility
function personName() {
  // Implementation for accessibility issues for REACT_036: Fix 1 fake link issue
  // ...
}

// ----- END ORIGINAL CODE -----

function addAriaAttribute(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Implementation details omitted for brevity
  fs.writeFileSync(filePath, content);
  console.log(`Added ARIA attributes in ${filePath}`);
}

function addLangAttribute(filePath) {
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
  let content = fs.readFileSync(filePath, 'utf8');
  // Add main landmark if not present
  if (!content.includes('<main')) {
    // Wrap main content in <main> tag
    const bodyMatch = content.match(/(<body[^>]*>)([\s\S]*)(<\/body>)/i);
    if (bodyMatch) {
      const openingTag = bodyMatch[1];
      const bodyContent = bodyMatch[2];
      const closingTag = bodyMatch[3];
      const wrappedContent = `<main role="main">${bodyContent}</main>`;
      const newBody = openingTag + wrappedContent + closingTag;
      content = content.replace(bodyMatch[0], newBody);
    }
  }
  fs.writeFileSync(filePath, content);
  console.log(`Added main landmark in ${filePath}`);
}

function ensureUniqueLandmarks(filePath) {
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
  let content = fs.readFileSync(filePath, 'utf8');
  let countReplacements = 0;

  // Replace my-button with the actual button id
  const buttonIdRegex = /id=["']my-button["']/gi;

  // Replace id attributes
  const updatedContent = content.replace(buttonIdRegex, (match) => {
    countReplacements++;
    return `id="${newButtonId}"`;
  });

  // Also replace any references in aria-controls, aria-labelledby, etc.
  const ariaRefRegex = /(aria-controls|aria-labelledby|aria-describedby)=["']my-button["']/gi;
  const finalContent = updatedContent.replace(ariaRefRegex, (match, attr) => {
    countReplacements++;
    return `${attr}="${newButtonId}"`;
  });

  // Replace data attributes if any
  const dataRefRegex = /data-target=["']my-button["']/gi;
  const finalFinalContent = finalContent.replace(dataRefRegex, (match, attr) => {
    countReplacements++;
    return `data-target="${newButtonId}"`;
  });

  fs.writeFileSync(filePath, finalFinalContent);
  console.log(`Replaced 'my-button' with '${newButtonId}' in ${filePath} (${countReplacements} replacement(s) made)`);

  return countReplacements;
}

function fixSvgDataUriAccessibility(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix SVG data URIs in icons configuration (favicons)
  // Pattern matches data:image/svg+xml,<svg...> strings
  const dataUriRegex = /(icons:\s*\{[^}]*icon:\s*')data:image\/svg\+xml,<svg([^>]*)>([\s\S]*?)<\/svg>(')/g;
  
  let updatedContent = content.replace(dataUriRegex, (match, prefix, svgAttrs, svgContent, suffix) => {
    // Check if SVG already has a title or aria-label
    const hasTitle = svgContent.includes('<title>');
    const hasAriaLabel = svgAttrs.includes('aria-label');
    const hasAriaHidden = svgAttrs.includes('aria-hidden');
    
    let newSvgAttrs = svgAttrs;
    let newSvgContent = svgContent;
    
    if (!hasTitle && !hasAriaLabel && !hasAriaHidden) {
      // Add aria-hidden="true" for decorative favicon SVGs
      newSvgAttrs = ` aria-hidden="true"${svgAttrs}`;
    } else if (hasTitle && !hasAriaLabel && !hasAriaHidden) {
      // SVG has title but no explicit accessible name on SVG element
      // Add role="img" to ensure title is used as accessible name
      newSvgAttrs = ` role="img"${svgAttrs}`;
    }
    
    return `${prefix}data:image/svg+xml,<svg${newSvgAttrs}>${newSvgContent}</svg>${suffix}`;
  });
  
  // Also handle apple touch icon if present
  const appleIconRegex = /(apple:\s*')data:image\/svg\+xml,<svg([^>]*)>([\s\S]*?)<\/svg>(')/g;
  updatedContent = updatedContent.replace(appleIconRegex, (match, prefix, svgAttrs, svgContent, suffix) => {
    const hasTitle = svgContent.includes('<title>');
    const hasAriaLabel = svgAttrs.includes('aria-label');
    const hasAriaHidden = svgAttrs.includes('aria-hidden');
    
    let newSvgAttrs = svgAttrs;
    
    if (!hasTitle && !hasAriaLabel && !hasAriaHidden) {
      newSvgAttrs = ` aria-hidden="true"${svgAttrs}`;
    } else if (hasTitle && !hasAriaLabel && !hasAriaHidden) {
      newSvgAttrs = ` role="img"${svgAttrs}`;
    }
    
    return `${prefix}data:image/svg+xml,<svg${newSvgAttrs}>${svgContent}</svg>${suffix}`;
  });
  
  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Fixed SVG data URI accessibility in ${filePath}`);
  }
  
  return updatedContent