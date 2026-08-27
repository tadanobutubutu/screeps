// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

//_Commit: 7c71fe35502d1cacefd35e209f9d20be82c56fc3_

//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->
// TODO: Add back any required exports that might have been?
// (This comment remains as-is)
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]

// Existing function to get accessible name
const getAccessibleName = (element) => {
  if (!element) return null;
  
  // Check aria-label first
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = element.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) return referencedElement.textContent;
  }
  
  // Check for visible text content
  const text = element.textContent?.trim();
  if (text) return text;
  
  // Check for title attribute
  const title = element.getAttribute('title');
  if (title) return title;
  
  return null;
};

// Existing function to set accessible name
const setAccessibleName = (element, name) => {
  if (!element || !name) return;
  
  // Clear any existing labeledby
  if (element.hasAttribute('aria-labelledby')) {
    element.removeAttribute('aria-labelledby');
  }
  
  // Set aria-label
  element.setAttribute('aria-label', name);
};

// Existing function to wrap primary content in main landmark
const wrapPrimaryContentInMain = () => {
  // Check if main element already exists
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    // Find the body or first significant content
    const body = document.body;
    if (!body) return;
    
    // Look for common content containers
    let contentElement = body.querySelector('[role="main"]') || 
                         body.querySelector('.content') || 
                         body.querySelector('#content') ||
                         body.firstElementChild;
    
    if (contentElement && contentElement.tagName !== 'MAIN') {
      mainElement = document.createElement('main');
      mainElement.setAttribute('id', 'main-content');
      
      // Wrap the content element
      contentElement.parentNode.insertBefore(mainElement, contentElement);
      mainElement.appendChild(contentElement);
    }
  }
  
  return mainElement;
};

// New function to add lang attribute to the HTML element
const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
};

// New function to fix table structure issues
const fixTableStructure = () => {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }
    
    // Check if table has proper headers
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');
    
    if (headers.length > 0 && rows.length > 0) {
      headers.forEach(header => {
        if (!header.getAttribute('scope')) {
          // Determine if it's a column or row header
          const parentRow = header.parentElement;
          const headerIndex = Array.from(parentRow.children).indexOf(header);
          const firstCell = parentRow.firstElementChild;
          
          if (firstCell === header) {
            header.setAttribute('scope', 'row');
          } else {
            header.setAttribute('scope', 'col');
          }
        }
      });
    }
  });
};

// New function to add/fix landmark issues
const addMainLandmark = () => {
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main');
    
    const body = document.body;
    if (body && body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else if (body) {
      body.appendChild(mainElement);
    }
  } else if (!mainElement.id) {
    mainElement.setAttribute('id', 'main');
  }
};

// New function to ensure unique landmarks
const ensureUniqueLandmarks = () => {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
    const seen = new Set();
    
    elements.forEach(element => {
      let id = element.id;
      
      if (!id) {
        let generatedId;
        let counter = 0;
        
        do {
          generatedId = `${landmark}-${counter}`;
          counter++;
        } while (seen.has(generatedId));
        
        id = generatedId;
        element.setAttribute('id', id);
      }
      
      // Ensure uniqueness across all landmarks of the same type
      while (seen.has(id)) {
        let baseId = id;
        let suffix = 1;
        
        while (seen.has(`${baseId}-${suffix}`)) {
          suffix++;
        }
        
        id = `${baseId}-${suffix}`;
      }
      
      seen.add(id);
      element.setAttribute('id', id);
    });
  });
};

// New function to add accessible names to SVGs
const addSvgAccessibleNames = () => {
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const ariaLabel = svg.getAttribute('aria-label') || 
                      svg.getAttribute('aria-labelledby') ||
                      svg.querySelector('title')?.textContent;
    
    if (!ariaLabel) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', `SVG Icon ${index + 1}`);
    } else {
      svg.setAttribute('role', 'img');
    }
  });
};

// New function to fix fake link issues
const fixFakeLinkIssue = () => {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    if (!href || href === '#' || href === '') {
      link.setAttribute('role', 'link');
      link.setAttribute('href', '#');
    }
  });
};

// New function to validate the landmarks
const validateLandmark = () => {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  
  const missingLandmarks = landmarks.filter(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
    return elements.length === 0;
  });
  
  if (missingLandmarks.length > 0) {
    throw new Error(`Missing landmarks: ${missingLandmarks.join(', ')}`);
  }
};

// Add new function
const addCustomValidation = () => {
  // Validate that lang attribute is set
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    console.warn('HTML element is missing lang attribute');
    return false;
  }
  
  // Validate that main landmark exists
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    console.warn('Main landmark is missing');
    return false;
  }
  
  // Validate that tables have proper roles
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.getAttribute('role')) {
      console.warn('Table is missing role attribute');
    }
  });
  
  return true;
};

// Export all functions
module.exports = {
  getAccessibleName,
  setAccessibleName,
  wrapPrimaryContentInMain,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  validateLandmark,
  addCustomValidation
};