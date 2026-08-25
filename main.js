// Accessibility fixes for Screeps bots based on insight report
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix table structure issues (react implementation)
// - REACT_017: Add/fix landmark issues (react implementation)
// - REACT_041: Add accessible names to SVGs (react implementation)
// - REACT_025: Ensure unique landmarks (react implementation)

import React from 'react';

// Function to add lang attribute to HTML element
export function addLangAttribute(lang = 'en') {
  document.documentElement.lang = lang;
}

// REACT_025: Additional accessibility improvements
export function initializeAccessibility() {
  // Set default language attribute
  addLangAttribute();
  
  // Prevent tab trapping outside of modals by managing focus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.dispatchEvent(new CustomEvent('escapePressed'));
    }
  });
  
  // Ensure skip link functionality if skip link exists
  const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const target = document.querySelector('#main-content, main, [role="main"]');
      if (target) {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}

// Accessibility fix for REACT_027: Fix table structure issues (react implementation)
const fixTableStructure = (tableComponent) => {
  return React.forwardRef(({ caption, headers, rows, ...props }, ref) => {
    return (
      <table ref={ref} {...props}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {headers?.map((header, index) => (
              <th key={index} scope="col">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  });
};

// Accessibility fix for REACT_017: Add/fix landmark issues (react implementation)
const addLandmarkIssues = (Component, landmarkType, label) => {
  const landmarkRoles = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    aside: 'complementary',
    footer: 'contentinfo',
    section: 'region',
  };

  return React.forwardRef(({ role = landmarkRoles[landmarkType], ...props }, ref) => {
    return (
      <Component
        ref={ref}
        role={role}
        aria-label={label}
        {...props}
      />
    );
  });
};

// Accessibility fix for REACT_041: Add accessible names to SVGs (react implementation)
export const addSvgAccessibleNames = (svgProps) => {
  return {
    ...svgProps,
    role: 'img',
    'aria-label': svgProps.label || 'Decorative icon',
    'aria-hidden': svgProps['aria-hidden'] ?? !svgProps.label,
  };
};

// Accessibility fix for REACT_025: Ensure unique landmarks (react implementation)
export const ensureUniqueLandmarks = (landmarkElements) => {
  return landmarkElements.map((element, index) => {
    const existingLabel = element.props?.['aria-label'];
    const uniqueLabel = existingLabel || `${element.props?.role || 'section'}-${index + 1}`;

    return React.cloneElement(element, {
      ...element.props,
      'aria-label': uniqueLabel,
    });
  });
};

// Address accessibility issues from insight report for image alt texts and add Landmark Regions
export { addLandmarkRegions, fixImageAltTexts };

// Accessibility functions for the Google sign-in logic
export { googleSignIn };

// Export the remaining accessibility functions
export { fixTableStructure, addLandmarkIssues };

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

// Existing code preserved - add your app initialization below
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// root.render(<App />);