function calculate(a, b) {
  return a + b;
}

// Add accessible name to SVG elements and update HTML root element to include the lang attribute
export function addAccessibleNameToSvg(svg, name) {
  const titleElement = document.createElement('title');
  titleElement.textContent = 'Accessible name for SVG';
  svg.insertBefore(titleElement, svg.firstChild);

  // Add role="img" for accessibility
  if (name) {
    svg.setAttribute('role', 'img');
  }

  // Update to include the lang attribute in the HTML root element
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', htmlElement.getAttribute('lang') || 'en');
  }

  return svg;
}

// Add scope attribute to th elements as per the issue and replace fake link (<a href="#">) with a real button for accessibility per REACT_036
export function addScopeToTableHeaders() {
  const tableHeaders = document.querySelectorAll('th:not([scope])');
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
    const parent = link.parentNode;
    if (parent) {
      parent.replaceChild(button, link);
    }
  });
}

// Wrap primary content in <main> landmark for accessibility per REACT_017
export function addMainLandmark() {
  // Find the table with id "table-rotated"
  const tableElement = document.getElementById('table-rotated');
  if (tableElement && !tableElement.closest('main')) {
    const mainElement = document.createElement('main');
    const parent = tableElement.parentNode;
    if (parent) {
      parent.insertBefore(mainElement, tableElement);
      mainElement.appendChild(tableElement);
    }
  }

  // Find the container with Quality & Metrics Reports content
  const metricsContainer = document.querySelector('.container');
  if (metricsContainer && !metricsContainer.closest('main')) {
    const mainElement = document.createElement('main');
    const parent = metricsContainer.parentNode;
    if (parent) {
      parent.insertBefore(mainElement, metricsContainer);
      mainElement.appendChild(metricsContainer);
    }
  }

  return document.querySelectorAll('main');
}

// Export all functions except the extra addLangToHtmlRoot function
export { calculate, addAccessibleNameToSvg, addScopeToTableHeaders, replaceFakeLinksWithButtons, addMainLandmark };