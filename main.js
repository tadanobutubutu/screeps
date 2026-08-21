function calculate(a, b) {
  return a + b;
}

// Add accessible name to SVG elements (REACT_041)
export function addAccessibleSvgName(svg, name) {
  const titleElement = document.createElement('title');
  titleElement.textContent = name;
  svg.insertBefore(titleElement, svg.firstChild);

  // Add role="img" for accessibility
  if (svg && !svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }

  return svg;
}

// Update to include the lang attribute in the HTML root element (REACT_015)
export function addLangToHtmlRoot(lang) {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

// Add scope attribute to th elements as per the issue (REACT_027)
export function addScopeToTableHeaders() {
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    if (header && !header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
  return tableHeaders;
}

// Replace fake link (<a href="#">) with a real button for accessibility per REACT_036
export function replaceFakeLinksWithButtons() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    if (link.id) {
      button.id = link.id;
    }
    const parent = link.parentNode;
    if (parent) {
      parent.replaceChild(button, link);
    }
  });
  return fakeLinks;
}

// Ensure unique landmarks for accessibility (REACT_025)
export function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, footer, aside');
  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      landmark.id = `landmark-${index}`;
    }
  });
  return landmarks;
}

// New function with contribution from origin/main
function calculateWithContribution(contribution, a, b) {
  return a + b + contribution;
}

// Export all functions
export { calculate, addAccessibleSvgName, addLangToHtmlRoot, addScopeToTableHeaders, replaceFakeLinksWithButtons, calculateWithContribution };