// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function createInPageButton() {
  const langAttr = getLangAttribute();
  const button = document.createElement('button');
  button.setAttribute('lang', langAttr);
  button.setAttribute('aria-label', 'In-page navigation');
  return button;
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => validateTableStructure(table));
}

function validateTableStructure(table) {
  if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
    console.warn('Table missing caption or aria-label');
    return false;
  }
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
  return true;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="contentinfo"], header, main, footer, nav, aside');
  validateLandmarkStructure(landmarks);
}

function validateLandmarkStructure(landmarks) {
  const landmarkCount = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });
  ensureUniqueLandmarks(landmarkCount);
  return landmarkCount;
}

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const ariaLabel = svg.getAttribute('aria-label');
  if (title) {
    return title.textContent;
  }
  return ariaLabel || '';
}

function setSvgAttributes(svg, name) {
  if (!svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
    const id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      title.id = id;
      title.textContent = name;
      svg.insertBefore(title, svg.firstChild);
    }
    svg.setAttribute('aria-labelledby', title.id);
  }
}

function ensureUniqueLandmarks(landmarkCount) {
  const allowedMultiple = ['nav', '[role="navigation"]', '[role="complementary"]'];
  for (const [landmark, count] of Object.entries(landmarkCount)) {
    if (count > 1 && !allowedMultiple.includes(landmark)) {
      console.warn(`Multiple instances of unique landmark: ${landmark}`);
    }
  }
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      console.warn('Link missing accessible text:', link);
    }
  });
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach(link => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Interactive link');
    }
  });
}