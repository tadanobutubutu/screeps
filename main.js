const { getHTML } = require('./utils');
const { processDOM } = require('./dom-manipulation');

function addLangAttribute() {
  processDOM(getHTML('setLangAttribute'), { lang: 'en' });
}

function handleButtonClick(buttonId) {
  const button = document.getElementById(buttonId);
  if (button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
    button.setAttribute('aria-expanded', isExpanded);
  }
}

function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[data-fake-link], .fake-link');
  fakeLinks.forEach(fakeLink => {
    if (fakeLink.tagName === 'DIV' || fakeLink.tagName === 'SPAN') {
      const a = document.createElement('a');
      a.href = fakeLink.dataset.href || fakeLink.getAttribute('href') || '#';
      a.textContent = fakeLink.textContent;
      a.setAttribute('role', 'button');
      Array.from(fakeLink.attributes).forEach(attr => {
        if (attr.name !== 'href' && attr.name !== 'class') {
          a.setAttribute(attr.name, attr.value);
        }
      });
      fakeLink.parentNode.replaceChild(a, fakeLink);
    }
  });
}

function ensureUniqueLandmarks() {
  const existingHeaders = Array.from(document.querySelectorAll('header[role="banner"]'));
  const existingFooters = Array.from(document.querySelectorAll('footer[role="contentinfo"]'));

  if (existingHeaders.length > 1) {
    existingHeaders.forEach((header, index) => {
      if (index > 0) {
        header.remove();
      }
    });
  }
  if (existingFooters.length > 1) {
    existingFooters.forEach((footer, index) => {
      if (index > 0) {
        footer.remove();
      }
    });
  }
}

function addLandmarkRegions() {
  const banners = document.querySelectorAll('header[role="banner"]');
  if (banners.length === 0) {
    const banner = document.createElement('header');
    banner.setAttribute('role', 'banner');
    document.body.appendChild(banner);
  }
  
  const footers = document.querySelectorAll('footer[role="contentinfo"]');
  if (footers.length === 0) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.appendChild(footer);
  }
  
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.appendChild(main);
  }
}

function wrapPrimaryContentInMain() {
  let mainElement;
  const existingMains = Array.from(document.querySelectorAll('main, [role="main"]'));

  existingMains.forEach((main, index) => {
    if (index > 0) {
      main.remove();
    }
  });

  const contentContainer = document.querySelector('#content') || document.querySelector('.content') || document.body;

  if (!existingMains.length) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');
  } else {
    mainElement = existingMains[0];
  }

  if (!contentContainer.closest('main, [role="main"]')) {
    while (contentContainer.firstChild) {
      mainElement.appendChild(contentContainer.firstChild);
    }
    contentContainer.appendChild(mainElement);
  }
}

function addScopeToTableHeaders() {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

function addAccessibleSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const existingTitle = svg.querySelector('title');
    if (!existingTitle) {
      const title = document.createElement('title');
      title.textContent = svg.getAttribute('aria-label') || `SVG graphic ${index + 1}`;
      title.id = `svg-title-${index}`;
      svg.insertBefore(title, svg.firstChild);
    }
    const titleId = existingTitle ? existingTitle.id : `svg-title-${index}`;
    if (!svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

function processAccessibilityIssues(insightReport) {
  if (insightReport && insightReport.issues) {
    insightReport.issues.forEach(issue => {
      switch (issue.code) {
        case 'REACT_015':
          addLangAttribute();
          break;
        case 'FAKE_LINKS':
          fixFakeLinks();
          break;
        case 'UNIQUE_LANDMARKS':
          ensureUniqueLandmarks();
          break;
        case 'LANDMARK_STRUCTURE':
          wrapPrimaryContentInMain();
          break;
        case 'ACCESSIBLE_SVGS':
          addAccessibleSVGs();
          break;
        case 'TABLE_HEADERS':
          addScopeToTableHeaders();
          break;
        default:
          break;
      }
    });
  }

  addLangAttribute();
  fixFakeLinks();
  ensureUniqueLandmarks();
  wrapPrimaryContentInMain();
  addAccessibleSVGs();
  addScopeToTableHeaders();
}

const myButton = document.getElementById('myButton');
if (myButton) {
  myButton.setAttribute('aria-label', 'My Button');
  myButton.setAttribute('role', 'button');
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processAccessibilityIssues);
  } else {
    processAccessibilityIssues();
  }
}

module.exports = {
  wrapPrimaryContentInMain,
  handleButtonClick,
  addLangAttribute,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addScopeToTableHeaders,
  addAccessibleSVGs,
  processAccessibilityIssues,
  getHTML,
  processDOM,
};