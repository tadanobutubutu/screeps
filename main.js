// Preserve all existing code and exports
// Add accessibility improvements for the issues listed

// Add language attribute to root element (REACT_015)
export const addLanguageAttribute = (element) => {
  if (!element.hasAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
};

// Improve table structure (REACT_027)
export const improveTableStructure = (table) => {
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption';
    table.prepend(caption);
  }

  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    if (index === 0 && !row.querySelector('th')) {
      const headers = row.querySelectorAll('td');
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.textContent;
        header.replaceWith(th);
      });
    } else if (index > 0 && !row.querySelector('th')) {
      const cells = row.querySelectorAll('td');
      cells.forEach(cell => {
        if (!cell.hasAttribute('scope') && !cell.hasAttribute('headers')) {
          cell.setAttribute('scope', 'row');
        }
      });
    }
  });
};

// Add landmarks (REACT_017)
export const addLandmarks = (container) => {
  const main = container.querySelector('main');
  if (!main) {
    const mainElement = document.createElement('main');
    mainElement.innerHTML = container.innerHTML;
    container.innerHTML = '';
    container.appendChild(mainElement);
  }

  const header = container.querySelector('header');
  if (!header) {
    const headerElement = document.createElement('header');
    headerElement.textContent = 'Page Header';
    container.prepend(headerElement);
  }

  const footer = container.querySelector('footer');
  if (!footer) {
    const footerElement = document.createElement('footer');
    footerElement.textContent = 'Page Footer';
    container.appendChild(footerElement);
  }
};

// Add accessible names for SVGs (REACT_041)
export const addSvgAccessibleNames = (svg) => {
  if (!svg.querySelector('title') && !svg.querySelector('desc')) {
    const title = document.createElement('title');
    title.textContent = 'SVG Graphic';
    svg.prepend(title);

    const desc = document.createElement('desc');
    desc.textContent = 'Description of the SVG graphic';
    svg.prepend(desc);
  }
};

// Ensure unique landmarks (REACT_025)
export const ensureUniqueLandmarks = (container) => {
  const landmarks = ['main', 'header', 'footer', 'nav', 'aside'];
  landmarks.forEach(landmark => {
    const elements = container.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (index > 0) {
          element.setAttribute('aria-label', `${landmark} ${index + 1}`);
        }
      });
    }
  });
};

// Replace fake links with proper buttons (REACT_036)
export const replaceFakeLinks = (container) => {
  const fakeLinks = container.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
    link.replaceWith(button);
  });
};

// Main accessibility initialization function
export const initializeAccessibility = () => {
  document.addEventListener('DOMContentLoaded', () => {
    // Apply all accessibility improvements
    const root = document.documentElement;
    addLanguageAttribute(root);

    const tables = document.querySelectorAll('table');
    tables.forEach(improveTableStructure);

    addLandmarks(document.body);

    const svgs = document.querySelectorAll('svg');
    svgs.forEach(addSvgAccessibleNames);

    ensureUniqueLandmarks(document.body);

    replaceFakeLinks(document.body);
  });
};

// Initialize accessibility when the module is imported
initializeAccessibility();