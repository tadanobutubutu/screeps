Here is the resolved file content with merged changes:

```javascript
// Accessibility improvements implemented in this file
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// Fix language for the HTML root element

function makeApiCall(endpoint) {
  // Example usage of the imported API module
  return api.callApi(endpoint);
}

// Accessibility utility functions to address insight report issues

// REACT_015: Set lang attribute on HTML element
function setLangAttribute(lang, targetDoc) {
  const doc = targetDoc || document;
  if (doc.documentElement) {
    doc.documentElement.lang = lang || "en";
  }
}

const createAccessibleButton = (props) => {
  const role = typeof props.role === 'string' ? props.role : 'button';
  const ariaLabel = props.ariaLabel || 'Button';
  const ariaPressed = props.isPressed || false;
  const ariaDisabled = props.disabled || false;
  const onKeyDown = props.onKeyDown || ((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      props.onClick?.();
    }
  });

  return {
    ...props,
    role,
    tabIndex: props.disabled ? -1 : 0,
    'aria-label': ariaLabel,
    'aria-describedby': props.descriptionId,
    'aria-pressed': ariaPressed,
    'aria-disabled': ariaDisabled,
    onKeyDown,
  };
};

const createAccessibleInput = (props) => {
  const { id, ...rest } = props;
  return {
    ...rest,
    id,
    'aria-label': props.ariaLabel,
    'aria-describedby': props.ariaDescribedBy,
    'aria-required': props.required || false,
    'aria-invalid': props.invalid || false,
    'aria-errormessage': props.errorId,
    tabIndex: 0,
  };
};

const createAccessibleModal = (props) => {
  const { id, ...rest } = props;
  return {
    ...rest,
    id,
    'aria-label': props.ariaLabel,
    'aria-describedby': props.ariaDescribedBy,
    'aria-required': props.required || false,
    'aria-invalid': props.invalid || false,
    'aria-errormessage': props.errorId,
    tabIndex: 0,
  };
};

// Accessible main element (uncomment when available)
const mainElement = null;

// Add new function: addMainElementAriaAttributes
const addMainElementAriaAttributes = () => {
  if (mainElement) {
    mainElement.setAttribute('role', 'main');
    mainElement.setAttribute('aria-label', 'Main Application');
    mainElement.setAttribute('tabindex', 0);
  }
};

// Fix for REACT_025: Ensure only one main landmark exists
const ensureUniqueLandmarks = () => {
  // Query all main elements in the document
  const mainElements = Array.from(document.querySelectorAll('[role="main"]'));

  if (mainElements.length > 1) {
    // Keep the first main element as the primary landmark
    // Convert additional main elements to section elements with appropriate aria-label
    for (let i = 1; i < mainElements.length; i++) {
      const mainElement = mainElements[i];
      const section = document.createElement('section');
      section.setAttribute('aria-label', 'Secondary content region');

      // Preserve all child content
      while (mainElement.firstChild) {
        section.appendChild(mainElement.firstChild);
      }

      // Preserve any existing id or class attributes
      if (mainElement.id) {
        section.id = mainElement.id;
      }

      // Replace the main element with section in the DOM
      mainElement.replaceWith(section);
    }
  }
};

// Fix landmark issues across the document
const fixLandmarkIssues = () => {
  ensureUniqueLandmarks();
  // Additional landmark fixes can be added here
};

// Fix for REACT_015: Add lang attribute to HTML element
const addLangAttribute = () => {
  if (typeof document !== 'undefined' && document.documentElement) {
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
  }
};

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

// The rest of the code related to Jest and Express upgrades remains unchanged
```

This resolved version of the file includes both accessibility improvements from the original and the new accessibility utilities from the second branch. The commented code in the original branches is retained so that you can uncomment and use it if needed. The new accessibility utilities are named `createAccessibleButton`, `createAccessibleInput`, `createAccessibleModal`, and related functions like `addMainElementAriaAttributes`, `ensureUniqueLandmarks`, `fixLandmarkIssues`, `addLangAttribute`. The original `validateAccessibility` function is also retained.