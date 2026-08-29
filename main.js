import { class1, function1, Object1 } from './path/to/module';

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_025: Add other accessibility changes as per the insight report
// [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

function getLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = lang;
  }
  return document;
}

// Function to fix table structure issues
function validateTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }

    if (!existingTbody) {
      const remainingRows = rows.length > 0 ? Array.from(rows).slice(1) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
          const firstCell = cells[0];
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.insertBefore(th, firstCell);
        }
      }
    });
  });

  return document;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = null;

  if (!mainElement) {
    const body = document.body;
    const main = document.createElement('main');
    if (main) {
      main.setAttribute('id', 'main-content');
    }

    const children = body.children;
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }

    if (mainElement && mainElement.tagName !== 'MAIN') {
      mainElement.setAttribute('role', 'main');
    }

    mainElement = main;
  }

  return mainElement;
}

// Function to ensure unique landmarks (combined approach)
function ensureUniqueLandmarks(document) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });

  const mains = document.querySelectorAll('[role="main"]');
  if (mains.length > 1) {
    mains.forEach((main, index) => {
      main.setAttribute('aria-label', `Main content ${index + 1}`);
    });
  }

  return document;
}

// Function to add accessible names to SVGs
function setSvgAttributes(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
    }
  });
  return document;
}

// Function to add accessible names to SVG elements
function getSvgAccessibleName(document) {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg, index) => {
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.textContent.trim()) {
      svg.setAttribute('aria-label', titleElement.textContent.trim());
    } else {
      svg.setAttribute('aria-label', `Graphic ${index + 1}`);
    }
  });
  return document;
}

// Function to fix fake link issue (merged fixes)
function handleFakeLinks(document) {
  const clickableElements = document.querySelectorAll('[onclick]');
  let count = 0;

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';

    if (!isAnchor && (onclick.includes('window.location') || onclick.includes('href'))) {
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          element.click();
        }
      });

      if (element.className) {
        span.className = element.className;
      }

      element.parentNode.replaceChild(span, element);
      count++;
    }
  });

  return document;
}

// Function to fix fake link issues (handles both role="link" elements and anchors with href="#")
function validateLinkAccessibility(document) {
  // Fix non-anchor elements with role="link"
  const roleLinks = document.querySelectorAll('[role="link"]');
  roleLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });

  // Fix anchors with href="#" by converting them to accessible buttons
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });

  return document;
}

// Function to fix landmark issues and add Landmark Regions
function validateLandmark(document) {
  const landmarks = document.querySelectorAll('[role="navigation"], [role="banner"], [role="contentinfo"]');
  landmarks.forEach(landmark => {
    if (!landmark.id && !landmark.getAttribute('aria-label')) {
      const role = landmark.getAttribute('role');
      landmark.setAttribute('aria-label', `${role} region`);
    }
  });
}

// Function to add landmark regions
function validateLandmarkStructure(document) {
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    if (!section.id) {
      section.id = `section-${index + 1}`;
    }
    if (!section.getAttribute('role') && section.querySelector('h2, h3, h4, h5, h6')) {
      section.setAttribute('role', 'region');
      section.setAttribute('aria-label', `Section ${index + 1}`);
    }
  });
}

// Function to add proper landmark regions
function addProperLandmarkRegions(document) {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  landmarks.forEach((landmark, index) => {
    if (!landmark.getAttribute('role')) {
      const tagName = landmark.tagName.toLowerCase();
      const roleMap = {
        'header': 'banner',
        'nav': 'navigation',
        'main': 'main',
        'aside': 'complementary',
        'footer': 'contentinfo'
      };
      if (roleMap[tagName]) {
        landmark.setAttribute('role', roleMap[tagName]);
      }
    }
    if (!landmark.id) {
      landmark.id = `landmark-${index + 1}`;
    }
  });
  return document;
}

// REACT_025: Ensure unique landmarks (by role approach)
function ensureUniqueLandmarksByRole(document) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });

  const mains = document.querySelectorAll('[role="main"], main');
  if (mains.length > 1) {
    mains.forEach((main, index) => {
      main.setAttribute('aria-label', `Main content ${index + 1}`);
    });
  }

  return document;
}

// Function to add accessible names to SVGs (alias)
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `Accessible SVG ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  return document;
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
    const buttonContainer = document.querySelector('#g-signin2');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large' }
      );
    }
  }
}

// Helper function for Google sign-in credential handling
function handleCredentialResponse(response) {
  console.log('ID Token: ' + response.credential);
}

// Export all functions for testing
export {
  getLangAttribute,
  validateTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  setSvgAttributes,
  getSvgAccessibleName,
  handleFakeLinks,
  validateLinkAccessibility,
  validateLandmark,
  validateLandmarkStructure,
  addProperLandmarkRegions,
  ensureUniqueLandmarksByRole,
  addSvgAccessibleNames,
  googleSignIn,
  handleCredentialResponse
};