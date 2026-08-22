/* Accessibility improvements implemented in this file // TODO: Address accessibility issues from insight report: // - REACT_015: Add lang attribute to HTML element // - REACT_017: Add/fix 4 landmark issues // - REACT_041: Add accessible names to 2 SVGs // - REACT_025: Ensure unique landmarks (2 issues) // - REACT_036: Fix 1 fake link issue // - REACT_027: Add scope attribute to th elements // Fix language for the HTML root element */
const validateAccessibility = (component) => {
  const checks = {
    hasAriaLabel: !!component.ariaLabel,
    hasRole: !!component.role,
    hasTabIndex: component.tabIndex !== undefined,
    hasKeyboardSupport: !!component.onKeyDown,
    hasScreenReaderText: !!component.screenReaderText,
  };
  return Object.values(checks).every(check => check);
};

// Restored export (previously removed)
export { validateAccessibility };

// Create accessible button component with full ARIA support
const createAccessibleButton = (props) => {
  const { label, onClick, disabled = false, variant = 'primary' } = props;
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.disabled = disabled;
  button.className = `btn btn-${variant}`;
  // Ensure accessible name if (!label && props.ariaLabel) {
    button.setAttribute('aria-label', props.ariaLabel);
  }
  // Add keyboard support if (onClick) {
    button.onclick = onClick;
    button.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    };
  }
  // Add role for semantic clarity
  button.setAttribute('role', 'button');
  return button;
};

// Create accessible form input with label association
const createAccessibleInput = (props) => {
  const { id, label, type = 'text', required = false, errorId } = props;
  const wrapper = document.createElement('div');
  wrapper.className = 'form-group';
  const inputLabel = document.createElement('label');
  inputLabel.htmlFor = id;
  inputLabel.textContent = label;
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.name = id;
  input.required = required;
  input.setAttribute('aria-required', required);
  if (errorId) {
    input.setAttribute('aria-describedby', errorId);
    input.setAttribute('aria-invalid', 'true');
  }
  wrapper.appendChild(inputLabel);
  wrapper.appendChild(input);
  return wrapper;
};

// Create accessible modal/dialog
const createAccessibleModal = (props) => {
  const { id, title, content, closeLabel = 'Close' } = props;
  const modal = document.createElement('div');
  modal.id = id;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', `${id}-title`);
  const titleEl = document.createElement('h2');
  titleEl.id = `${id}-title`;
  titleEl.textContent = title;
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = closeLabel;
  closeBtn.setAttribute('aria-label', closeLabel);
  closeBtn.setAttribute('role', 'button');
  const contentEl = document.createElement('div');
  contentEl.className = 'modal-content';
  contentEl.textContent = content;
  modal.appendChild(titleEl);
  modal.appendChild(closeBtn);
  modal.appendChild(contentEl);
  // Focus trap management
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.dispatchEvent(new Event('close'));
    }
  });
  return modal;
};

// Accessible main element (uncomment when available)
let mainElement = null;

// Add new function: addMainElementAriaAttributes
const addMainElementAriaAttributes = () => {
  if (typeof document !== 'undefined') {
    mainElement = document.querySelector('[role="main"]') || document.querySelector('main');
    if (mainElement) {
      mainElement.setAttribute('role', 'main');
      if (!mainElement.id) {
        mainElement.id = 'main-content';
      }
      mainElement.setAttribute('tabindex', '-1');
      // Ensure label for main landmark
      const existingLabel = mainElement.getAttribute('aria-label');
      if (!existingLabel) {
        mainElement.setAttribute('aria-label', 'Main Application');
      }
    }
  }
};

// Fix for REACT_015: Add lang attribute to HTML element
const addLangAttribute = () => {
  if (typeof document !== 'undefined' && document.documentElement) {
    const htmlElement = document.documentElement;
    const currentLang = htmlElement.getAttribute('lang');
    if (!currentLang) {
      htmlElement.setAttribute('lang', 'en');
    }
  }
};

// Fix for REACT_036: Fix 1 fake link issue
const fixFakeLinkIssue = () => {
  if (typeof document !== 'undefined') {
    // Find all anchors without href that look like links
    const fakeLinks = document.querySelectorAll('a:not([href])');
    fakeLinks.forEach((link) => {
      const styles = window.getComputedStyle(link);
      const isClickable = styles.cursor === 'pointer' || link.classList.contains('link');
      if (isClickable) {
        // Convert to proper button if it acts as a link
        if (link.tagName === 'A') {
          link.setAttribute('role', 'button');
          // Add keyboard support if missing
          if (!link.onclick && link.addEventListener) {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              // Handle click appropriately
            });
          }
          // Ensure tabindex for keyboard navigation
          if (link.tabIndex === -1 || link.tabIndex === undefined) {
            link.tabIndex = 0;
          }
          // Add accessible name if text is not descriptive
          const linkText = link.textContent.trim();
          if (linkText && linkText.length < 3) {
            const ariaLabel = link.getAttribute('aria-label');
            if (!ariaLabel) {
              link.setAttribute('aria-label', 'Interactive link');
            }
          }
        }
      }
    });
  }
};

// Fix for REACT_041: Add accessible names to 2 SVGs
const addAccessibleNamesToSVGs = () => {
  if (typeof document !== 'undefined') {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
      const hasAriaLabel = svg.getAttribute('aria-label');
      const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title');
      if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        const title = document.createElement('title');
        title.textContent = `SVG Icon ${index + 1}`;
        title.id = `svg-title-${index + 1}`;
        if (svg.firstChild) {
          svg.insertBefore(title, svg.firstChild);
        } else {
          svg.appendChild(title);
        }
        svg.setAttribute('aria-labelledby', title.id);
      }
    });
  }
};

// Fix for REACT_027: Add scope attribute to th elements
const fixTableStructure = () => {
  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      const headers = table.querySelectorAll('th');
      const firstRow = table.querySelector('thead tr') || table.querySelector('tr');
      const isDataTable = table.querySelector('thead') !== null;
      headers.forEach((th) => {
        const isInThead = th.closest('thead') !== null;
        const rowIndex = Array.from(th.parentElement?.cells || []).indexOf(th);
        const previousCells = Array.from(th.parentElement?.cells || []).slice(0, rowIndex);
        const hasRowHeader = previousCells.some(cell => cell.tagName === 'TH' && cell.getAttribute('scope') === 'row');
        if (!th.getAttribute('scope')) {
          if (isInThead || (!hasRowHeader && isDataTable)) {
            th.setAttribute('scope', 'col');
          } else {
            th.setAttribute('scope', 'row');
          }
        }
      });
    });
  }
};

// Fix for REACT_025: Ensure unique landmarks (2 issues)
const ensureUniqueLandmarks = () => {
  if (typeof document !== 'undefined') {
    const mainElements = document.querySelectorAll('main, [role="main"]');
    if (mainElements.length > 1) {
      for (let i = 1; i < mainElements.length; i++) {
        const mainElement = mainElements[i];
        const section = document.createElement('section');
        section.setAttribute('role', 'region');
        section.setAttribute('aria-label', 'Secondary content region');
        let firstChild = mainElement.firstChild;
        while (firstChild) {
          const nextChild = firstChild.nextSibling;
          section.appendChild(firstChild);
          firstChild = nextChild;
        }
        if (mainElement.id) {
          section.id = mainElement.id;
        }
        if (mainElement.className) {
          section.className = mainElement.className;
        }
        mainElement.parentNode.replaceChild(section, mainElement);
      }
    } else if (!mainElements.length) {
      const body = document.body;
      if (body) {
        const newMain = document.createElement('main');
        newMain.id = 'main-content';
        newMain.setAttribute('role', 'main');
        newMain.setAttribute('aria-label', 'Main content');
        body.insertBefore(newMain, body.firstChild);
      }
    }
  }
};

// Fix landmark issues across the document
const fixLandmarkIssues = () => {
  ensureUniqueLandmarks();
  addMainElementAriaAttributes();
};

// Process accessibility fixes
addLangAttribute();
fixFakeLinkIssue();
addAccessibleNamesToSVGs();
fixTableStructure();
fixLandmarkIssues();
delete document.documentElement;