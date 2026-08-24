const { getHTML } = require('./utils');
const { processDOM } = require('./dom-manipulation');

// Existing functions
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
  // ... (remaining code for ensureUniqueLandmarks is the same)
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

function addProperLandmarkRegions() {
  const existingMains = document.querySelectorAll('main, [role="main"]');
  const existingBanners = document.querySelectorAll('header[role="banner"]');
  const existingFooters = document.querySelectorAll('footer[role="contentinfo"]');

  if (existingMains.length === 0) {
    addLandmarkRegions();
  }

  const contentContainer = document.querySelector('#content') || document.querySelector('.content') || document.body;

  if (!contentContainer.closest('main, [role="main"], header[role="banner"]')) {
    if (contentContainer === document.body) {
      addLandmarkRegions();
    } else {
      const mainElementOrBanner = document.createElement('main');
      mainElementOrBanner.setAttribute('role', 'main');
      contentContainer.appendChild(mainElementOrBanner);
    }
  }

  if (!existingMains.length && !existingBanners.length) {
    while (contentContainer.firstChild) {
      contentContainer.firstChild.closest('main, [role="main"], header[role="banner"]').appendChild(contentContainer.firstChild);
    }
    contentContainer.appendChild(contentContainer.closest('main, [role="main"], header[role="banner"]'));
  }
}

module.exports = {
  addLangAttribute,
  handleButtonClick,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRegions,
  wrapPrimaryContentInMain,
  addProperLandmarkRegions,
};