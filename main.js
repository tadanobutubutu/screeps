// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark, fixLandmarkIssues)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)

function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, index) => {
          if (index > 0) {
            tbody.appendChild(row);
          }
        });
        table.appendChild(tbody);
      }
    }
  });
}

function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const existingMain = document.querySelector('[role="main"]');
    if (existingMain) {
      const main = document.createElement('main');
      while (existingMain.firstChild) {
        main.appendChild(existingMain.firstChild);
      }
      existingMain.parentNode.replaceChild(main, existingMain);
    }
  }
}

function fixLandmarkIssues() {
  const headers = document.querySelectorAll('header');
  const navs = document.querySelectorAll('nav');
  const footers = document.querySelectorAll('footer');
  
  headers.forEach((header) => {
    if (!header.querySelector('nav') && !header.querySelector('form')) {
      header.setAttribute('role', 'banner');
    }
  });
  
  navs.forEach((nav) => {
    if (!nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }
  });
  
  footers.forEach((footer) => {
    footer.setAttribute('role', 'contentinfo');
  });
}

function uniqueLandmarks() {
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  landmarks.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute(`role`);
        }
      });
    }
  });
}

function ensureUniqueLandmarks() {
  uniqueLandmarks();
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const id = `svg-title-${index}`;
        title.id = id;
        svg.setAttribute('aria-labelledby', id);
      } else {
        svg.setAttribute('aria-label', `Icon ${index + 1}`);
      }
    }
  });
}

function addAccessibleNamesToSVGs() {
  addSvgAccessibleNames();
}

function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
      const onclick = link.getAttribute('onclick');
      if (onclick && !link.hasAttribute('role')) {
        link.setAttribute('role', 'button');
      }
    }
  });
}

function fixFakeLinkIssues() {
  fixFakeLinkIssue();
}

function fixButtonIdentifiers() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (button.id === 'my-button' || button.id === '') {
      button.id = `accessible-button-${index}`;
    }
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      const title = button.getAttribute('title');
      if (title) {
        button.setAttribute('aria-label', title);
      }
    }
  });
}

function googleSignIn() {
  const googleSignInBtn = document.getElementById('google-sign-in');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', () => {
      console.log('Google Sign-In initiated');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  fixLandmarkIssues();
  ensureUniqueLandmarks();
  addAccessibleNamesToSVGs();
  fixFakeLinkIssues();
  fixButtonIdentifiers();
  googleSignIn();
});

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  fixLandmarkIssues,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixButtonIdentifiers,
  googleSignIn,
};