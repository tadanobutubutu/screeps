export function addAccessibleNameToSVG(svg) {
  const titleElement = document.createElement('title');
  titleElement.textContent = 'Accessible name for SVG';
  svg.insertBefore(titleElement, svg.firstChild);

  // Add role="img" for accessibility
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }

  return svg;
}

export function addLangToHtmlRoot(lang) {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

export function addScopeToTableHeaders() {
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

export function replaceFakeLinksWithButtons() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    if (link.id) {
      button.id = link.id;
    }
    // Click handler to clear viewport transform (as per snippet)
    button.addEventListener('click', function() {
      const viewport = document.getElementById('viewport');
      if (viewport) {
        viewport.style.transform = '';
      }
    });
    const parent = link.parentNode;
    if (parent) {
      parent.replaceChild(button, link);
    }
  });
}

function calculate(a, b) {
  return a + b;
}

function calculateWithContribution(contribution, a, b) {
  return a + b + contribution;
}

export { calculate, addAccessibleNameToSVG, addLangToHtmlRoot, addScopeToTableHeaders, replaceFakeLinksWithButtons, calculateWithContribution };