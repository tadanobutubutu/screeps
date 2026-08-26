// ... existing imports and declarations ...

function addLangAttribute(htmlElement, lang = 'en') {
  // Add lang attribute to the provided htmlElement
  if (htmlElement && htmlElement.setAttribute) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

function fixTableStructure(table) {
  // Fix table structure issues in the provided table
  if (!table || table.tagName !== 'TABLE') {
    return table;
  }

  const tbody = table.querySelector('tbody');
  if (!tbody && table.rows) {
    const wrapper = document.createElement('tbody');
    while (table.firstChild) {
      wrapper.appendChild(table.firstChild);
    }
    table.appendChild(wrapper);
  }

  return table;
}

function addMainLandmark(rootElement) {
  // Add main landmark to the provided rootElement
  if (!rootElement) {
    return null;
  }

  const existingMain = rootElement.querySelector('main, [role="main"]');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    while (rootElement.firstChild) {
      mainElement.appendChild(rootElement.firstChild);
    }
    rootElement.insertBefore(mainElement, rootElement.firstChild);
  }

  return rootElement;
}

function ensureUniqueLandmarks() {
  // Ensure unique landmarks in the entire application
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0 && el.id) {
          el.id = `${el.id}-${index}`;
        }
      });
    }
  });
}

function addSvgAccessibleNames(svgElement) {
  // Add accessible names to the provided svgElement
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return svgElement;
  }

  const title = svgElement.querySelector('title');
  if (!title) {
    const newTitle = document.createElement('title');
    newTitle.textContent = 'Decorative graphic';
    svgElement.insertBefore(newTitle, svgElement.firstChild);
  }

  const desc = svgElement.querySelector('desc');
  if (!desc) {
    const newDesc = document.createElement('desc');
    newDesc.textContent = '';
    svgElement.appendChild(newDesc);
  }
  
  return svgElement;
}

function fixFakeLinkIssue(link) {
  // Fix fake link issues in the provided link
  if (!link) {
    return link;
  }

  if (link.href === '#' || link.href === '' || !link.href) {
    const parent = link.parentElement;
    if (parent && parent.tagName === 'A') {
      const hasClickHandler = parent.onclick || parent.getAttribute('onclick');
      if (!hasClickHandler) {
        parent.setAttribute('role', 'button');
      }
    }
  }

  return link;
}

function hideDecorativeSvg(svgElement) {
  // Add aria-hidden="true" to decorative SVGs that lack an accessible name
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return svgElement;
  }

  const hasAccessibleName =
    svgElement.hasAttribute('aria-label') ||
    svgElement.hasAttribute('aria-labelledby') ||
    svgElement.querySelector('title');

  if (!hasAccessibleName) {
    svgElement.setAttribute('aria-hidden', 'true');
  }

  return svgElement;
}

// ... any other existing functions or code ...

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
const rootElement = document.querySelector('html') || document.body;

if (rootElement) {
  addLangAttribute(rootElement);
  addMainLandmark(rootElement);
}

ensureUniqueLandmarks();

export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  hideDecorativeSvg,
};