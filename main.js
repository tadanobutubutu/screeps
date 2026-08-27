// Address accessibility issues from insight report

// Focus trap for modals/dialogs
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
    if (e.key === 'Escape') {
      element.blur();
    }
  });
}

// Announce content to screen readers
function announceToScreenReader(message, priority = 'polite') {
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

// Skip link handler
function handleSkipLink(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus();
  }
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Accessible hide/show toggle
function setAccessibleHidden(element, isHidden) {
  if (isHidden) {
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('hidden', '');
  } else {
    element.removeAttribute('aria-hidden');
    element.removeAttribute('hidden');
  }
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
}

// REACT_027: Fix table structure issues
function fixTableStructure(container = document) {
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        firstRow.setAttribute('scope', 'col');
      }
    }
    if (!table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      const hasThead = table.querySelector('thead');
      let startIndex = hasThead ? 1 : 0;
      if (startIndex < rows.length) {
        const tbody = document.createElement('tbody');
        for (let i = startIndex; i < rows.length; i++) {
          tbody.appendChild(rows[i]);
        }
        table.appendChild(tbody);
      }
    }
  });
}

// REACT_017: Add main landmark
function addMainLandmark(container = document) {
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length === 0) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('role', 'main');
    const body = container.querySelector('body');
    if (body && body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else if (body) {
      body.appendChild(main);
    }
  } else {
    mainElements.forEach((main, index) => {
      if (!main.id) {
        main.setAttribute('id', index === 0 ? 'main-content' : `main-content-${index + 1}`);
      }
    });
  }
}

// Fix landmark issues
function fixLandmarkIssues(container = document) {
  const landmarks = {
    header: container.querySelectorAll('header:not([role])'),
    footer: container.querySelectorAll('footer:not([role])'),
    nav: container.querySelectorAll('nav:not([aria-label])')
  };
  
  landmarks.header.forEach((el, i) => {
    if (!el.id) el.id = `header-${i + 1}`;
  });
  
  landmarks.footer.forEach((el, i) => {
    if (!el.id) el.id = `footer-${i + 1}`;
  });
  
  landmarks.nav.forEach((el, i) => {
    if (!el.getAttribute('aria-label')) {
      const label = el.closest('header') ? 'Primary navigation' : 
                    el.closest('footer') ? 'Footer navigation' : 
                    `Navigation ${i + 1}`;
      el.setAttribute('aria-label', label);
    }
  });
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(container = document) {
  const usedIds = new Set();
  const elements = container.querySelectorAll('[id]');
  
  elements.forEach(el => {
    const id = el.id;
    if (usedIds.has(id)) {
      let counter = 1;
      let newId = `${id}-${counter}`;
      while (usedIds.has(newId)) {
        counter++;
        newId = `${id}-${counter}`;
      }
      el.id = newId;
      usedIds.add(newId);
    } else {
      usedIds.add(id);
    }
  });
}

function uniqueLandmarks(container = document) {
  return ensureUniqueLandmarks(container);
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(container = document) {
  const svgs = container.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `Icon ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

function addAccessibleNamesToSVGs(container = document) {
  addSvgAccessibleNames(container);
}

// REACT_036: Fix fake link issues
function fixFakeLinkIssue(link) {
  if (link && link.tagName === 'A' && !link.href && !link.getAttribute('onclick')) {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  }
}

function fixFakeLinkIssues(container = document) {
  const links = container.querySelectorAll('a:not([href])');
  links.forEach(link => fixFakeLinkIssue(link));
}

// REACT_037: Google sign-in logic
function googleSignIn() {
  const signInButton = document.getElementById('google-sign-in') || 
                       document.querySelector('[data-google-sign-in]');
  
  if (signInButton) {
    const handleSignIn = () => {
      announceToScreenReader('Signing in with Google, please wait...', 'polite');
      signInButton.setAttribute('aria-busy', 'true');
      signInButton.setAttribute('disabled', 'true');
    };
    
    signInButton.addEventListener('click', handleSignIn);
    signInButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleSignIn();
      }
    });
    
    if (!signInButton.id) {
      signInButton.id = 'google-sign-in';
    }
    signInButton.setAttribute('aria-label', 'Sign in with Google');
  }
}

// REACT_040: Fix button identifiers
function fixButtonIdentifiers(container = document) {
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (button.classList.contains('my-button') || button.id === 'my-button') {
      const action = button.textContent.trim().toLowerCase().replace(/\s+/g, '-') || `button-${index + 1}`;
      button.id = action;
      button.classList.remove('my-button');
    }
    if (!button.id) {
      const text = button.textContent.trim().toLowerCase().replace(/\s+/g, '-') || `btn-${index + 1}`;
      button.id = text;
    }
  });
}

// ----- END ORIGINAL CODE -----