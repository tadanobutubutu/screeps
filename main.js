import accessibilityModule from 'accessibility-module';

// Add lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// Fix 26 table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');

      cells.forEach((cell, cellIndex) => {
        if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
          if (cellIndex === 0) {
            cell.setAttribute('scope', 'row');
          } else {
            cell.setAttribute('scope', 'col');
          }
        }
      });
    });
  });
}

// Add accessible names to 2 SVGs (REACT_041)
function addAccessibleSVGNames() {
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const existingTitle = svg.querySelector('title');
    const existingDesc = svg.querySelector('desc');
    
    if (!existingTitle) {
      const title = document.createElement('title');
      title.textContent = svg.getAttribute('aria-label') || `SVG graphic ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
    
    if (!existingDesc) {
      const desc = document.createElement('desc');
      desc.textContent = `SVG graphic ${index + 1}`;
      desc.id = `svg-desc-${index + 1}`;
      svg.insertBefore(desc, svg.firstChild);
    }
    
    if (existingTitle && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-labelledby', existingTitle.id);
    }
  });
}

// Add/fix 4 landmark issues
function addMainLandmark() {
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
}

function validateLandmark() {
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!main) {
    console.warn('No main landmark found');
    return false;
  }
  return true;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('header, main, footer, nav, aside');
  const landmarkCount = {};
  
  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    landmarkCount[tag] = (landmarkCount[tag] || 0) + 1;
  });
  
  return landmarkCount;
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, footer, nav, aside');
  const seenIds = new Set();
  
  landmarks.forEach(landmark => {
    const id = landmark.id;
    if (id) {
      if (seenIds.has(id)) {
        landmark.removeAttribute('id');
      } else {
        seenIds.add(id);
      }
    }
  });
}

// Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, footer, nav, aside');
  const seenIds = new Set();
  
  landmarks.forEach(landmark => {
    const id = landmark.id;
    if (id) {
      if (seenIds.has(id)) {
        landmark.removeAttribute('id');
        const newId = `${id}-${Date.now()}`;
        landmark.setAttribute('id', newId);
      } else {
        seenIds.add(id);
      }
    }
  });
}

// Fix 1 fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  
  fakeLinks.forEach(link => {
    const onClick = link.getAttribute('onclick');
    if (onClick && !link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
      createAccessibleLink(link);
    }
  });
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  const issues = [];
  
  links.forEach(link => {
    if (!link.textContent.trim() && !link.hasAttribute('aria-label')) {
      issues.push({
        element: link,
        issue: 'Link has no accessible name'
      });
    }
  });
  
  return issues;
}

function createInPageButton() {
  const buttons = document.querySelectorAll('[