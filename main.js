function getLangAttribute() {
  const htmlElement = document.documentElement;
  const lang = htmlElement.getAttribute('lang') || 'en';
  htmlElement.setAttribute('lang', lang);
  return lang;
}

function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Skip to main content';
  button.setAttribute('aria-label', 'Skip to main content');
  button.className = 'in-page-button';
  return button;
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  tables.forEach((table, index) => {
    if (!table.querySelector('caption, thead, th')) {
      issues.push(`Table ${index}: missing header or caption`);
    }
    if (!table.getAttribute('aria-label') && !table.querySelector('caption')) {
      issues.push(`Table ${index}: missing accessible name`);
    }
  });
  return issues;
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      const headerCells = row.querySelectorAll('th');
      if (rowIndex === 0 && headerCells.length === 0) {
        issues.push(`Table ${index}, row ${rowIndex}: missing header row`);
      }
      cells.forEach((cell, cellIndex) => {
        if (!cell.getAttribute('scope') && rowIndex === 0) {
          issues.push(`Table ${index}, row ${rowIndex}, cell ${cellIndex}: missing scope attribute`);
        }
      });
    });
  });
  return issues;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section');
  const issues = [];
  landmarks.forEach((landmark, index) => {
    const tag = landmark.tagName.toLowerCase();
    if (tag === 'section' || tag === 'div') {
      if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
        issues.push(`Landmark ${index}: ${tag} missing accessible name`);
      }
    }
    if (!landmark.getAttribute('role') && !landmark.getAttribute('aria-label')) {
      issues.push(`Landmark ${index}: missing role or aria-label`);
    }
  });
  return issues;
}

function validateLandmarkStructure() {
  const issues = [];
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    issues.push(`Multiple main landmarks found: ${mains.length}`);
  }
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      issues.push(`Nav landmark ${index}: missing aria-label`);
    }
  });
  return issues;
}

function getSvgAccessibleName(svg) {
  const titleEl = svg.querySelector('title');
  if (titleEl) {
    return titleEl.textContent.trim();
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelledEl = document.getElementById(ariaLabelledBy);
    if (labelledEl) {
      return labelledEl.textContent.trim();
    }
  }
  const descEl = svg.querySelector('desc');
  if (descEl) {
    return descEl.textContent.trim();
  }
  return svg.getAttribute('title') || '';
}

function setSvgAttributes(svg) {
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.getAttribute('focusable') && svg.getAttribute('role') === 'img') {
    svg.setAttribute('focusable', 'false');
  }
  const name = getSvgAccessibleName(svg);
  if (name && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    const titleId = svg.id ? `${svg.id}-title` : `svg-title-${Date.now()}`;
    const titleEl = svg.querySelector('title');
    if (titleEl) {
      titleEl.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    } else {
      const newTitle = document.createElement('title');
      newTitle.id = titleId;
      newTitle.textContent = name;
      svg.insertBefore(newTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', titleId);
    }
  }
  return svg;
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  const issues = [];
  links.forEach((link, index) => {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledBy = link.getAttribute('aria-labelledby');
    const title = link.getAttribute('title');
    if (!text && !ariaLabel && !ariaLabelledBy && !title) {
      issues.push(`Link ${index}: missing accessible name`);
    }
    if (text && text.length < 3 && !ariaLabel && !title) {
      issues.push(`Link ${index}: ambiguous link text "${text}"`);
    }
  });
  return issues;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href^="javascript:"], a[href^="javascript void"]');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
    if (!link.getAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    if (!link.getAttribute('aria-disabled')) {
      link.setAttribute('aria-disabled', 'true');
    }
  });
  return fakeLinks;
}

module.exports = {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
};