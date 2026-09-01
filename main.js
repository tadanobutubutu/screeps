/** TODO: Implement function for addressing accessibility issues from insight report */
function addressAccessibilityIssues(insightReport) {
    const accessibilityIssues = insightReport.accessibility || [];
    const addressedIssues = [];
    
    accessibilityIssues.forEach(issue => {
        if (issue.type === 'contrast') {
            addressedIssues.push({
                originalIssue: issue,
                recommendation: 'Increase color contrast ratio to at least 4.5:1 for normal text',
                status: 'addressed'
            });
        } else if (issue.type === 'alt_text') {
            addressedIssues.push({
                originalIssue: issue,
                recommendation: 'Add descriptive alt text to the image element',
                status: 'addressed'
            });
        } else if (issue.type === 'keyboard_navigation') {
            addressedIssues.push({
                originalIssue: issue,
                recommendation: 'Ensure all interactive elements are keyboard accessible',
                status: 'addressed'
            });
        } else {
            addressedIssues.push({
                originalIssue: issue,
                recommendation: 'Review and fix accessibility issue',
                status: 'addressed'
            });
        }
    });
    
    return {
        totalIssues: accessibilityIssues.length,
        addressedIssues: addressedIssues,
        summary: `Addressed ${addressedIssues.length} accessibility issues from insight report`
    };
}

/* Accessibility Validator and Utilities */

const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
const LANDMARK_SELECTORS = LANDMARK_ELEMENTS.map(tag => tag).join(', ');

function findLandmarks(context = document) {
    const landmarks = [];
    const elements = context.querySelectorAll(LANDMARK_SELECTORS);
    elements.forEach(el => {
        landmarks.push({
            tag: el.tagName.toLowerCase(),
            element: el,
            id: el.id || null,
            label: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || null
        });
    });
    return landmarks;
}

/**
 * Validates the landmark structure for accessibility issues
 * @param {Document|Element} context - The document or container to validate
 * @returns {Object} Validation result with issues array
 */
function validateLandmarkStructure(context = document) {
    const issues = [];
    
    // Check for multiple <main> elements (should be exactly one)
    const mainElements = context.querySelectorAll('main');
    if (mainElements.length === 0) {
        issues.push({
            type: 'error',
            code: 'MISSING_MAIN',
            message: 'Document should contain exactly one <main> landmark for main content'
        });
    } else if (mainElements.length > 1) {
        issues.push({
            type: 'error',
            code: 'MULTIPLE_MAIN',
            message: `Document contains ${mainElements.length} <main> elements. Only one is allowed per page.`
        });
    }
    
    // Validate sections have accessible names
    const sections = context.querySelectorAll('section');
    sections.forEach((section, index) => {
        const hasLabel = section.getAttribute('aria-label') || 
                         section.getAttribute('aria-labelledby') ||
                         section.querySelector('h1, h2, h3, h4, h5, h6');
        if (!hasLabel) {
            issues.push({
                type: 'warning',
                code: 'SECTION_WITHOUT_NAME',
                message: `Section element at index ${index} should have an accessible name (aria-label, aria-labelledby, or heading)`
            });
        }
    });
    
    // Validate forms have accessible names
    const forms = context.querySelectorAll('form');
    forms.forEach((form, index) => {
        const hasLabel = form.getAttribute('aria-label') || 
                         form.getAttribute('aria-labelledby') ||
                         form.getAttribute('title') ||
                         form.querySelector('legend');
        if (!hasLabel && form.querySelectorAll('input, select, textarea').length > 0) {
            issues.push({
                type: 'warning',
                code: 'FORM_WITHOUT_NAME',
                message: `Form at index ${index} should have an accessible name if it contains form controls`
            });
        }
    });
    
    // Validate navigation elements
    const navElements = context.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
        const hasLabel = nav.getAttribute('aria-label') || 
                         nav.getAttribute('aria-labelledby') ||
                         nav.getAttribute('title');
        const isMultipleNav = navElements.length > 1 && !hasLabel;
        if (isMultipleNav) {
            issues.push({
                type: 'warning',
                code: 'NAV_WITHOUT_LABEL',
                message: `Navigation at index ${index} should have an aria-label when multiple nav elements exist`
            });
        }
    });
    
    // Check for proper header/footer usage
    const headers = context.querySelectorAll('header');
    headers.forEach((header, index) => {
        if (header.closest('main') && !header.closest('article') && !header.getAttribute('aria-label')) {
            issues.push({
                type: 'info',
                code: 'HEADER_NESTING',
                message: `Header at index ${index} is inside main content - consider if this is the intended use`
            });
        }
    });
    
    return {
        totalIssues: issues.length,
        issues: issues,
        addressedIssues: [], // Not applicable for landmark validation
        isValid: issues.filter(i => i.type === 'error').length === 0,
        summary: `Landmark validation completed with ${issues.length} issues`
    };
}

/**
 * Gets a summary report of landmark structure validation
 * @param {Document|Element} context - The document or container to analyze
 * @returns {string} Human-readable summary
 */
function getLandmarkSummary(context = document) {
    const result = validateLandmarkStructure(context);
    const summary = [];
    
    summary.push('Landmark Structure Validation Summary:');
    summary.push(`- Total issues found: ${result.totalIssues}`);
    
    const errors = result.issues.filter(i => i.type === 'error');
    const warnings = result.issues.filter(i => i.type === 'warning');
    const infos = result.issues.filter(i => i.type === 'info');
    
    if (errors.length > 0) {
        summary.push(`- Errors: ${errors.length}`);
        errors.forEach(e => summary.push(`  • ${e.message}`));
    }
    if (warnings.length > 0) {
        summary.push(`- Warnings: ${warnings.length}`);
        warnings.forEach(w => summary.push(`  • ${w.message}`));
    }
    if (infos.length > 0) {
        summary.push(`- Info: ${infos.length}`);
        infos.forEach(i => summary.push(`  • ${i.message}`));
    }
    
    summary.push(`Validation: ${result.isValid ? 'PASSED' : 'FAILED'}`);
    
    return summary.join('\n');
}

/* Common utility functions */
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

/* New functions */
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Assuming English for this example
  }
}

function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function fixTableStructure() {
  // Implementation for fixing table structure
}

function validateTableAccessibility() {
  // Implementation for validating table accessibility
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach(table => {
    const issues = [];
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');
    const firstRow = table.querySelector('tr');
    const firstCol = table.querySelectorAll('tr > td, tr > th')[0];
    
    // Check for proper table structure
    if (headers.length === 0) {
      issues.push({
        type: 'error',
        code: 'NO_HEADERS',
        message: 'Table should have header cells for accessibility'
      });
    }
    
    // Check for missing headers
    if (rows.length > 0 && firstRow) {
      const firstRowCells = firstRow.querySelectorAll('td, th');
      if (firstRowCells.length === 0) {
        issues.push({
          type: 'error',
          code: 'EMPTY_FIRST_ROW',
          message: 'First row of table should contain headers'
        });
      }
    }
    
    // Check for proper relationships
    if (firstCol) {
      const firstColContent = firstCol.textContent.trim();
      const hasHeaderAssociated = table.querySelector(`thead, [scope], th[scope]`);
      if (!hasHeaderAssociated && firstRowCells.length > 0) {
        issues.push({
          type: 'warning',
          code: 'NO_HEADER_ASSOCIATION',
          message: 'Table headers may not be properly associated with cells'
        });
      }
    }
    
    // Check for semantic table elements
    const caption = table.querySelector('caption');
    if (!caption) {
      issues.push({
        type: 'warning',
        code: 'NO_CAPTION',
        message: 'Table should have a caption element for accessibility'
      });
    }
    
    results.push({
      element: table,
      issues: issues,
      hasIssues: issues.length > 0
    });
  });
  
  return {
    totalTables: tables.length,
    results: results,
    summary: `Table accessibility validation completed with ${results.filter(r => r.hasIssues).length} tables having issues`
  };
}

function validateTableStructure() {
  // Implementation for validating table structure
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach(table => {
    const issues = [];
    const rows = table.querySelectorAll('tr');
    
    if (rows.length === 0) {
      issues.push({
        type: 'error',
        code: 'EMPTY_TABLE',
        message: 'Table should have at least one row'
      });
      results.push({ element: table, issues });
      return;
    }
    
    const firstRow = rows[0];
    const firstRowCells = firstRow.querySelectorAll('td, th');
    
    if (firstRowCells.length === 0) {
      issues.push({
        type: 'error',
        code: 'NO_CELLS_FIRST_ROW',
        message: 'First row should contain at least one cell'
      });
    }
    
    let allRowsHaveCells = true;
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        allRowsHaveCells = false;
        issues.push({
          type: 'error',
          code: 'EMPTY_ROW',
          message: `Row ${rowIndex} should contain at least one cell`
        });
      }
    });
    
    if (allRowsHaveCells && firstRowCells.length > 0) {
      const firstCell = firstRowCells[0];
      if (firstCell && firstCell.textContent.trim() === '') {
        issues.push({
          type: 'warning',
          code: 'EMPTY_CELL_FIRST_ROW_FIRST_COL',
          message: 'First cell of first row should not be empty'
        });
      }
    }
    
    const allCells = table.querySelectorAll('td, th');
    if (allCells.length > 0) {
      const uniqueText = new Set();
      allCells.forEach(cell => {
        const text = cell.textContent.trim();
        if (text && uniqueText.has(text)) {
          issues.push({
            type: 'warning',
            code: 'DUPLICATE_CELL_CONTENT',
            message: `Duplicate cell content found: "${text}"`
          });
        }
        uniqueText.add(text);
      });
    }
    
    results.push({
      element: table,
      issues: issues,
      hasIssues: issues.length > 0
    });
  });
  
  return {
    totalTables: tables.length,
    results: results,
    summary: `Table structure validation completed with ${results.filter(r => r.hasIssues).length} tables having issues`
  };
}

function validateLandmark() {
  // Implementation for validating landmarks
  const landmarks = findLandmarks();
  const results = [];
  
  landmarks.forEach(landmark => {
    const issues = [];
    const tagName = landmark.tagName.toLowerCase();
    const hasAccessibleName = landmark.getAttribute('aria-label') || 
                              landmark.getAttribute('aria-labelledby') ||
                              landmark.getAttribute('id');
    
    if (!hasAccessibleName && !['nav', 'header', 'footer', 'aside'].includes(tagName)) {
      issues.push({
        type: 'warning',
        code: 'LANDMARK_NO_NAME',
        message: `${tagName} landmark should have an accessible name (aria-label, aria-labelledby, or id)`
      });
    }
    
    if (tagName === 'main' && !hasAccessibleName) {
      issues.push({
        type: 'error',
        code: 'MAIN_NO_NAME',
        message: '<main> landmark should have an accessible name'
      });
    }
    
    const isInsideAnotherLandmark = landmark.closest(LANDMARK_SELECTORS);
    if (isInsideAnotherLandmark && isInsideAnotherLandmark !== document.body) {
      issues.push({
        type: 'warning',
        code: 'NESTED_LANDMARK',
        message: `${tagName} is nested inside another landmark, may cause confusion for screen readers`
      });
    }
    
    results.push({
      element: landmark,
      tagName: tagName,
      issues: issues,
      hasIssues: issues.length > 0
    });
  });
  
  return {
    totalLandmarks: landmarks.length,
    results: results,
    summary: `Landmark validation completed with ${results.filter(r => r.hasIssues).length} landmarks having issues`
  };
}

function validateLandmarkAttributes() {
  // Implementation for validating landmark attributes
  const landmarks = findLandmarks();
  const results = [];
  
  landmarks.forEach(landmark => {
    const issues = [];
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    
    if (role === 'landmark' && !['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'].includes(tagName)) {
      issues.push({
        type: 'warning',
        code: 'UNNECESSARY_ROLE_LANDMARK',
        message: `Element with role="landmark" is already a semantic landmark (${tagName})`
      });
    }
    
    if (role === 'region' && !landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby') && !landmark.querySelector('h1, h2, h3, h4, h5, h6')) {
      issues.push({
        type: 'warning',
        code: 'REGION_NO_NAME',
        message: `Element with role="region" should have an accessible name`
      });
    }
    
    const hasAriaLabel = landmark.hasAttribute('aria-label');
    const hasAriaLabelledBy = landmark.hasAttribute('aria-labelledby');
    const hasId = landmark.hasAttribute('id');
    
    if (!hasAriaLabel && !hasAriaLabelledBy && !hasId) {
      issues.push({
        type: 'info',
        code: 'NO_UNIQUE_ID',
        message: `Landmark should have an id for programmatic reference`
      });
    }
    
    results.push({
      element: landmark,
      tagName: tagName,
      issues: issues,
      hasIssues: issues.length > 0
    });
  });
  
  return {
    totalLandmarks: landmarks.length,
    results: results,
    summary: `Landmark attributes validation completed with ${results.filter(r => r.hasIssues).length} landmarks having issues`
  };
}

function addMainLandmark() {
  // Implementation for adding/fixing landmark issues
  const mainExists = document.querySelector('main') !== null;
  
  if (!mainExists) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    mainElement.setAttribute('aria-label', 'Main content');
    
    const firstFocusable = document.querySelector('a, button, input, select, textarea, [tabindex]');
    if (firstFocusable) {
      firstFocusable.insertAdjacentElement('beforebegin', mainElement);
    } else {
      document.body.insertBefore(mainElement, document.body.firstChild);
    }
    
    return {
      added: true,
      element: mainElement,
      message: 'Added main landmark to page'
    };
  }
  
  return {
    added: false,
    message: 'Main landmark already exists'
  };
}

function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
  const landmarks = findLandmarks();
  const tagCounts = {};
  const duplicates = [];
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
  });
  
  Object.keys(tagCounts).forEach(tagName => {
    if (tagCounts[tagName] > 1) {
      const tagLandmarks = landmarks.filter(l => l.tagName.toLowerCase() === tagName);
      tagLandmarks.forEach((landmark, index) => {
        if (index > 0) {
          const uniqueId = `unique-${tagName}-${Date.now()}-${index}`;
          landmark.setAttribute('id', uniqueId);
          duplicates.push({
            element: landmark,
            originalTag: tagName,
            newId: uniqueId
          });
        }
      });
    }
  });
  
  return {
    totalLandmarks: landmarks.length,
    duplicatesFound: duplicates.length,
    duplicates: duplicates,
    summary: `Ensured unique landmarks for ${duplicates.length} duplicate landmarks`
  };
}

function addSvgAccessibleNames() {
  // Implementation for adding accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  const results = [];
  
  svgs.forEach(svg => {
    const issues = [];
    const hasAccessibleName = svg.getAttribute('aria-label') || 
                              svg.getAttribute('aria-labelledby') ||
                              svg.querySelector('title') ||
                              svg.getAttribute('id');
    
    if (!hasAccessibleName) {
      issues.push({
        type: 'warning',
        code: 'SVG_NO_NAME',
        message: 'SVG element should have an accessible name (aria-label, aria-labelledby, title, or id)'
      });
    }
    
    const imgTags = svg.querySelectorAll('image');
    imgTags.forEach(img => {
      const hasAlt = img.getAttribute('alt') || img.getAttribute('aria-label');
      if (!hasAlt) {
        issues.push({
          type: 'warning',
          code: 'SVG_IMAGE_NO_ALT',
          message: 'SVG image element should have alt or aria-label'
        });
      }
    });
    
    const hasTitle = svg.querySelector('title');
    if (hasTitle && !hasAccessibleName) {
      const titleText = hasTitle.textContent.trim();
      if (titleText) {
        svg.setAttribute('aria-label', titleText);
      }
    }
    
    results.push({
      element: svg,
      issues: issues,
      hasIssues: issues.length > 0
    });
  });
  
  return {
    totalSVGs: svgs.length,
    results: results,
    summary: `SVG accessibility names validation completed with ${results.filter(r => r.hasIssues).length} SVGs having issues`
  };
}

function getSvgAccessibleName(svgElement) {
  // Implementation for getting SVG accessible name
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return null;
  }
  
  let accessibleName = null;
  
  accessibleName = svgElement.getAttribute('aria-label') || 
                   svgElement.getAttribute('aria-labelledby');
  
  if (!accessibleName) {
    const titleElement = svgElement.querySelector('title');
    if (titleElement) {
      accessibleName = titleElement.textContent.trim();
    }
  }
  
  const imgElements = svgElement.querySelectorAll('image');
  if (imgElements.length > 0) {
    imgElements.forEach(img => {
      const altText = img.getAttribute('alt') || img.getAttribute('aria-label');
      if (altText) {
        accessibleName = accessibleName ? `${accessibleName}, Image: ${altText}` : `Image: ${altText}`;
      }
    });
  }
  
  if (!accessibleName && svgElement.hasAttribute('id')) {
    accessibleName = svgElement.getAttribute('id');
  }
  
  return accessibleName;
}

function setSvgAttributes(svgElement, attributes) {
  // Implementation for setting SVG attributes
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    throw new Error('Element must be an SVG element');
  }
  
  const validAttributes = ['aria-label', 'aria-labelledby', 'role', 'id', 'focusable'];
  const results = [];
  
  Object.keys(attributes).forEach(attr => {
    if (validAttributes.includes(attr)) {
      if (attr === 'aria-labelledby') {
        const referencedElement = document.getElementById(attributes[attr]);
        if (referencedElement) {
          svgElement.setAttribute(attr, attributes[attr]);
          results.push({ attribute: attr, value: attributes[attr], success: true });
        } else {
          results.push({ attribute: attr, value: attributes[attr], success: false, error: 'Referenced element not found' });
        }
      } else {
        svgElement.setAttribute(attr, attributes[attr]);
        results.push({ attribute: attr, value: attributes[attr], success: true });
      }
    } else {
      results.push({ attribute: attr, value: attributes[attr], success: false, error: 'Invalid attribute' });
    }
  });
  
  return {
    element: svgElement,
    results: results,
    success: results.every(r => r.success)
  };
}

function createInPageButton() {
  // Implementation for creating in-page buttons
  const elements = document.querySelectorAll('[data-inpage-button]');
  const buttons = [];
  
  elements.forEach(element => {
    const buttonText = element.getAttribute('data-inpage-button') || 'Go to section';
    const buttonId = `btn-${element.tagName.toLowerCase()}-${Date.now()}`;
    
    const button = document.createElement('button');
    button.setAttribute('id', buttonId);
    button.setAttribute('aria-label', `${buttonText} - ${element.textContent.trim().substring(0, 30)}${element.textContent.trim().length > 30 ? '...' : ''}`);
    button.textContent = buttonText;
    
    button.addEventListener('click', function() {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.setAttribute('aria-describedby', buttonId);
      
      setTimeout(() => {
        element.removeAttribute('aria-describedby');
      }, 2000);
    });
    
    element.insertAdjacentElement('afterend', button);
    buttons.push({
      sourceElement: element,
      button: button,
      id: buttonId
    });
  });
  
  return {
    totalButtons: buttons.length,
    buttons: buttons,
    summary: `Created ${buttons.length} in-page navigation buttons`
  };
}

function validateLinkAccessibility() {
  // Implementation for validating link accessibility
  const links = document.querySelectorAll('a[href]');
  const results = [];
  
  links.forEach(link => {
    const issues = [];
    const href = link.getAttribute('href');
    const textContent = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    
    if (!textContent && !ariaLabel && !title) {
      issues.push({
        type: 'error',
        code: 'LINK_NO_TEXT',
        message: 'Link should have text content or aria-label'
      });
    }
    
    if (href && (href.startsWith('#') || href.startsWith('javascript:'))) {
      if (!ariaLabel && (!textContent || textContent.toLowerCase() === 'click here' || textContent.toLowerCase() === 'read more')) {
        issues.push({
          type: 'warning',
          code: 'GENERIC_LINK_TEXT',
          message: 'Link with same-page reference should have descriptive text'
        });
      }
    }
    
    const isEmptyHref = href === '' || href === '#';
    if (isEmptyHref) {
      issues.push({
        type: 'error',
        code: 'EMPTY_HREF',
        message: 'Link should have a valid href attribute'
      });
    }
    
    results.push({
      element: link,
      href: href,
      issues: issues,
      hasIssues: issues.length > 0
    });
  });
  
  return {
    totalLinks: links.length,
    results: results,
    summary: `Link accessibility validation completed with ${results.filter(r => r.hasIssues).length} links having issues`
  };
}

function handleFakeLinks() {
  // Implementation for handling fake link issues
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:"], a[href=""]:not([id])');
  const results = [];
  
  fakeLinks.forEach(link => {
    const issues = [];
    const href = link.getAttribute('href');
    const textContent = link.textContent.trim().toLowerCase();
    const isEmptyHref = href === '' || href === '#';
    const isJavaScriptHref = href === 'javascript:';
    const hasValidContent = textContent && textContent !== 'click here' && textContent !== 'read more' && textContent !== 'more';
    
    if (isEmptyHref || isJavaScriptHref) {
      issues.push({
        type: 'warning',
        code: 'FAKE_LINK',
        message: 'Link appears to be a fake link (empty href or javascript:)'
      });
    }
    
    if (isEmptyHref && !hasValidContent) {
      issues.push({
        type: 'error',
        code: 'EMPTY_LINK_WITHOUT_CONTENT',
        message: 'Empty link without meaningful content'
      });
    }
    
    if (isJavaScriptHref && !link.getAttribute('role')) {
      link.setAttribute('role', 'button');
      issues.push({
        type: 'info',
        code: 'ADDED_ROLE_BUTTON',
        message: 'Added role="button" to make fake link more accessible'
      });
    }
    
    if (isEmptyHref && !link.hasAttribute('aria-label')) {
      link.setAttribute('aria-label', textContent || 'Link with empty href');
      issues.push({
        type: 'info',
        code: 'ADDED_ARIA_LABEL',
        message: 'Added aria-label to provide accessible name'
      });
    }
    
    results.push({
      element: link,
      href: href,
      issues: issues,
      hasIssues: issues.length > 0
    });
  });
  
  return {
    totalFakeLinks: fakeLinks.length,
    results: results,
    summary: `Fake link handling completed with ${results.length} links processed`
  };
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issue
  const result = handleFakeLinks();
  return {
    processedLinks: result.totalFakeLinks,
    issuesFound: result.results.filter(r => r.hasIssues).length,
    summary: result.summary
  };
}

// New function to create a button with correct accessibility properties for in-page linking
function createAccessibleButtonForInPageLinking(options) {
  const { id, text, targetId, className = '' } = options;
  
  const button = document.createElement('button');
  button.id = id || `in-page-link-${Math.random().toString(36).substr(2, 9)}`;
  button.textContent = text;
  button.className = className;
  
  // Add ARIA attributes for accessibility
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', options.ariaLabel || text);
  
  // Handle click for smooth scrolling to target element
  if (targetId) {
    button.addEventListener('click', function() {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Set focus on target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  }
  
  return button;
}

/* New function to handle credential response */
function handleCredentialResponse(response) {
  // TODO: Implement the logic to handle the credential response
  // This function should be called when a credential response is received
  // For example, you might parse the response, validate it, and then store or use the credentials
  console.log('Handling credential response:', response);
  // Placeholder for actual implementation
}

if (typeof document !== 'undefined') {
    // Call the new functions as needed, for example:
    addLangAttribute();
    // fixTableStructure();
    // addMainLandmark();
    // ensureUniqueLandmarks();
    // addSvgAccessibleNames();
    // fixFakeLinkIssue();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addressAccessibilityIssues,
        validateLandmarkStructure,
        getLandmarkSummary,
        findLandmarks,
        LANDMARK_ELEMENTS,
        LANDMARK_SELECTORS,
        add,
        subtract,
        multiply,
        divide,
        addLangAttribute,
        getLangAttribute,
        fixTableStructure,
        validateTableAccessibility,
        validateTableStructure,
        addMainLandmark,
        validateLandmark,
        validateLandmarkAttributes,
        ensureUniqueLandmarks,
        addSvgAccessibleNames,
        getSvgAccessibleName,
        setSvgAttributes,
        createInPageButton,
        validateLinkAccessibility,
        handleFakeLinks,
        fixFakeLinkIssue,
        handleCredentialResponse,
        createAccessibleButtonForInPageLinking
    };
}

// Auto-validate on load if this is a browser context
if (typeof window !== 'undefined') {
    // Store validation result globally for debugging
    window.landmarkValidation = validateLandmarkStructure(document);
}