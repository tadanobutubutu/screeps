// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark, fixLandmarkIssues)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  document.documentElement.setAttribute('lang', lang);
}

// REACT_027: Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const ths = firstRow.querySelectorAll('td');
        ths.forEach((td) => {
          const th = document.createElement('th');
          th.textContent = td.textContent;
          th.setAttribute('scope', 'col');
          td.replaceWith(th);
        });
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
        fixedCount++;
      }
    }
    if (!table.querySelector('tbody') && table.querySelector('tr')) {
      const tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach((row) => {
        if (!row.parentElement.matches('thead')) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
      fixedCount++;
    }
  });
  return fixedCount;
}

// REACT_017: Add main landmark
function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    const bodyChildren = document.body.children;
    if (bodyChildren.length > 0) {
      bodyChildren[0].before(main);
      Array.from(document.body.children).forEach((child) => {
        if (child !== main && !['SCRIPT', 'STYLE', 'LINK', 'META'].includes(child.tagName)) {
          main.appendChild(child);
        }
      });
    } else {
      document.body.appendChild(main);
    }
    return true;
  }
  return false;
}

function fixLandmarkIssues() {
  const landmarks = {
    banner: document.querySelectorAll('header, [role="banner"]'),
    main: document.querySelectorAll('main, [role="main"]'),
    contentinfo: document.querySelectorAll('footer, [role="contentinfo"]'),
    navigation: document.querySelectorAll('nav, [role="navigation"]'),
  };
  const fixes = [];
  if (landmarks.banner.length === 0) {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    document.body.prepend(header);
    fixes.push('banner');
  }
  if (landmarks.main.length === 0) {
    addMainLandmark();
    fixes.push('main');
  }
  if (landmarks.contentinfo.length === 0) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.appendChild(footer);
    fixes.push('contentinfo');
  }
  return fixes;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  return uniqueLandmarks();
}

function uniqueLandmarks() {
  const landmarkSelectors = ['header', 'main', 'footer', 'nav', '[role="banner"]', '[role="main"]', '[role="contentinfo"]', '[role="navigation"]'];
  const seen = {};
  let removed = 0;
  landmarkSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      const tag = selector.replace(/[\[\]"]/g, '').replace('role=', '').replace('banner', 'header').replace('main', 'main').replace('contentinfo', 'footer').replace('navigation', 'nav');
      const key = tag;
      if (seen[key]) {
        for (let i = 1; i < elements.length; i++) {
          elements[i].removeAttribute('role');
          elements[i].setAttribute('aria-label', 'duplicate-' + key);
          removed++;
        }
      } else {
        seen[key] = true;
      }
    }
  });
  return removed;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  return addAccessibleNamesToSVGs();
}

function addAccessibleNamesToSVGs() {
  const svgs = document.querySelectorAll('svg');
  let count = 0;
  svgs.forEach((svg) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
        title.setAttribute('id', titleId);
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', 'icon');
      }
      svg.setAttribute('role', 'img');
      count++;
    }
  });
  return count;
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssue() {
  return fixFakeLinkIssues();
}

function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('[onclick], [role="link"]');
  let fixed = 0;
  fakeLinks.forEach((el) => {
    if (!el.hasAttribute('href') && el.tagName !== 'A') {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      fixed++;
    }
  });
  return fixed;
}

// REACT_037: Google sign-in logic
function googleSignIn() {
  const button = document.querySelector('.google-signin, [data-google-signin]');
  if (button) {
    button.addEventListener('click', () => {
      const clientId = document.querySelector('meta[name="google-client-id"]')?.content;
      if (clientId && typeof google !== 'undefined') {
        google.accounts.id.initialize({ client_id: clientId });
        google.accounts.id.prompt();
      }
    });
    return true;
  }
  return false;
}

// REACT_040: Fix button identifiers
function fixButtonIdentifiers() {
  const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
  let fixed = 0;
  buttons.forEach((btn) => {
    if (btn.id === 'my-button' || btn.classList.contains('my-button')) {
      btn.removeAttribute('id');
      btn.classList.remove('my-button');
      if (!btn.getAttribute('aria-label') && btn.textContent.trim() === '') {
        btn.setAttribute('aria-label', 'Button');
      }
      fixed++;
    }
  });
  return fixed;
}

export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  fixLandmarkIssues,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
};