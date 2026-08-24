const { getHTML } = require('./utils');
const { processDOM } = require('./dom-manipulation');

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && htmlElement.lang === '') {
    htmlElement.lang = 'en';
  }
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
  // Placeholder for ensureUniqueLandmarks functionality
  // TODO: Implement based on origin/main or HEAD context
}

function addLandmarkRegions() {
  const landmarks = ['main', 'header', 'footer', 'aside', 'section', 'article'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', 'landmark');
      }
    });
  });
}

function addProperLandmarkRegions() {
  /**
   * Adds proper landmark regions to the document for improved accessibility.
   * Ensures main, banner, and footer landmarks are correctly identified and structured.
   */
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

function addAccessibleNamesToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'Accessible title for SVG';
      svg.insertBefore(titleElement, svg.firstChild);
      svg.setAttribute('role', 'img');
    }
  });
}

function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('aria-label', 'This link goes to a section within the page');
  });
}

function fixLandmarkIssues() {
  const landmarks = {
    'nav': 'navigation',
    'main': 'main',
    'header': 'banner',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'section': 'region',
    'article': 'article'
  };

  Object.entries(landmarks).forEach(([tag, role]) => {
    const elements = document.querySelectorAll(tag);
    elements.forEach(element => {
      if (element.getAttribute('role') !== role) {
        element.setAttribute('role', role);
      }
    });
  });
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const existingThead = table.querySelector('thead');
    if (!existingThead) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const newRow = document.createElement('tr');
        const cells = firstRow.querySelectorAll('td');
        cells.forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          if (cell.getAttribute('scope')) {
            th.setAttribute('scope', cell.getAttribute('scope'));
          } else {
            th.setAttribute('scope', 'col');
          }
          newRow.appendChild(th);
        });
        thead.appendChild(newRow);
        table.insertBefore(thead, table.firstChild);
      }
    }

    const existingTbody = table.querySelector('tbody');
    if (!existingTbody) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 1) {
        const tbody = document.createElement('tbody');
        for (let i = 1; i < rows.length; i++) {
          tbody.appendChild(rows[i]);
        }
        table.appendChild(tbody);
      }
    }
  });
}

function fixImageAltTexts() {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.getAttribute('alt')) {
      img.setAttribute('alt', 'Image description');
    }
  });
}

function googleSignIn() {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' }
    );
  }
}

function handleCredentialResponse(response) {
  // Decode the JWT token
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  console.log('User signed in:', payload);
  // Handle the sign-in logic here
}

module.exports = {
  addLangAttribute,
  handleButtonClick,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRegions,
  addProperLandmarkRegions,
  googleSignIn
};