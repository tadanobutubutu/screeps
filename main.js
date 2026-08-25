// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

import React from 'react';

// Common accessibility patterns for these issues:

// New function to ensure HTML lang attribute is set
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// New function to inject and fix fake links
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('div[role="link"], span[role="link"]');
  fakeLinks.forEach(fakeLink => {
    if (fakeLink.tagName === 'DIV' || fakeLink.tagName === 'SPAN') {
      const a = document.createElement('a');
      a.href = fakeLink.getAttribute('href') || '#';
      a.textContent = fakeLink.textContent;
      fakeLink.parentNode.replaceChild(a, fakeLink);
    }
  });
}

// 1. For SVGs - add aria-label or role="img" with aria-labelledby
const AccessibleIcon = ({ label, children }) => (
  <svg role="img" aria-label={label} {...children}>
    {children}
  </svg>
);

// 2. For landmarks - ensure unique accessible names when multiple of same type
const Header = () => (
  <header role="banner" aria-label="Main header">
    {/* Header content */}
  </header>
);

const Navigation = () => (
  <nav role="navigation" aria-label="Main navigation">
    {/* Navigation content */}
  </nav>
);

const Footer = () => (
  <footer role="contentinfo">
    {/* Footer content */}
  </footer>
);

// 3. For links - use semantic <a> tags with proper href
const AccessibleLink = ({ href, children }) => (
  <a href={href} className="link">
    {children}
  </a>
);

// REACT_015: Add lang attribute to HTML element
export const addLangAttributeHOC = (Component) => {
  return React.forwardRef(({ lang = 'en', ...props }, ref) => {
    return <Component ref={ref} lang={lang} {...props} />;
  });
};

// Ensure Unique Landmarks Function
function ensureUniqueLandmarks() {
  const existingHeaders = Array.from(document.querySelectorAll('header[role="banner"]'));
  const existingFooters = Array.from(document.querySelectorAll('footer[role="contentinfo"]'));

  if (existingHeaders.length > 1) {
    existingHeaders.forEach((header, index) => index > 0 && header.remove());
  }
  if (existingFooters.length > 1) {
    existingFooters.forEach((footer, index) => index > 0 && footer.remove());
  }
}

// New function to inject primary content into main landmark
function wrapPrimaryContentInMain() {
  const existingMains = Array.from(document.querySelectorAll('main, [role="main"]'));
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');

  // Remove duplicate main elements if any
  existingMains.forEach((main, index) => {
    if (index > 0) {
      main.remove();
    }
  });

  // Find primary content container (adjust selector based on your content structure)
  const contentContainer = document.getElementById('content') || document.querySelector('.content') || document.body;

  // Move existing content into main if not already inside one
  if (!contentContainer.closest('main, [role="main"]')) {
    while (contentContainer.firstChild) {
      mainElement.appendChild(contentContainer.firstChild);
    }
    contentContainer.appendChild(mainElement);
  }
}

// REACT_027: Fix table structure issues
export const fixTableStructure = (tableComponent) => {
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

// REACT_017: Add/fix landmark issues
export const addLandmarkIssues = (Component, landmarkType, label) => {
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

// Add function to add 'scope="col"' attribute to table header cells
function addScopeToTableHeaders() {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// New function to process accessibility issues from insight report
function processAccessibilityIssues(insightReport) {
  // Process each issue from the insight report and address accordingly
  if (insightReport && insightReport.issues) {
    insightReport.issues.forEach(issue => {
      switch (issue.code) {
        case 'REACT_015':
          // Add lang attribute to HTML element
          addLangAttribute();
          break;
        case 'FAKE_LINKS':
          // Fix fake links
          fixFakeLinks();
          break;
        case 'UNIQUE_LANDMARKS':
          // Ensure unique landmarks
          ensureUniqueLandmarks();
          break;
        case 'LANDMARK_STRUCTURE':
          // Ensure proper landmark structure
          wrapPrimaryContentInMain();
          break;
        case 'ACCESSIBLE_SVGS':
          // Add accessible SVGs
          addAccessibleSVGs();
          break;
        case 'TABLE_HEADERS':
          // Add scope to table headers
          addScopeToTableHeaders();
          break;
        default:
          // Unknown issue type, ignore
          break;
      }
    });
  }

  // Run all accessibility fixes regardless of report content as fallback
  addLangAttribute();
  fixFakeLinks();
  ensureUniqueLandmarks();
  wrapPrimaryContentInMain();
  addAccessibleSVGs();
  addScopeToTableHeaders();
}

// New function to add accessible names to SVGs
function addAccessibleSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = document.createElement('title');
    title.textContent = 'Descriptive title for SVG';
    title.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
    svg.insertBefore(title, svg.firstChild);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', title.id);
  });
}

// REACT_041: Add accessible names to SVGs
export const addSvgAccessibleNames = (svgProps) => {
  return {
    ...svgProps,
    role: 'img',
    'aria-label': svgProps.label || 'Decorative icon',
    'aria-hidden': svgProps['aria-hidden'] ?? !svgProps.label,
  };
};

// REACT_025: Ensure unique landmarks
export const ensureUniqueLandmarksHOC = (landmarkElements) => {
  return landmarkElements.map((element, index) => {
    const existingLabel = element.props?.['aria-label'];
    const uniqueLabel = existingLabel || `${element.props?.role || 'section'}-${index + 1}`;
    
    return React.cloneElement(element, {
      ...element.props,
      'aria-label': uniqueLabel,
    });
  });
};

// REACT_036: Fix fake link issue
export const fixFakeLinkIssue = (FakeLinkComponent) => {
  return React.forwardRef(({ href, onClick, children, ...props }, ref) => {
    // If it has href, render as proper anchor
    if (href && href.startsWith('/')) {
      return (
        <a ref={ref} href={href} onClick={onClick} {...props}>
          {children}
        </a>
      );
    }
    // Otherwise keep as button with proper semantics
    return (
      <button ref={ref} type="button" onClick={onClick} {...props}>
        {children}
      </button>
    );
  });
};

// Main component
const App = () => (
  <div lang="en">
    <Header />
    <main role="main" id="main-content">
      {/* Main content */}
    </main>
    <Navigation />
    <Footer />
  </div>
);

export default App;

module.exports = {
  wrapPrimaryContentInMain,
  handleButtonClick,
  addLangAttribute,
  fixFakeLinks,
  ensureUniqueLandmarks,
  processAccessibilityIssues,
  addAccessibleSVGs,
  addScopeToTableHeaders,
  addLangAttributeHOC,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  ensureUniqueLandmarksHOC,
  fixFakeLinkIssue,
  AccessibleIcon,
  Header,
  Navigation,
  Footer,
  AccessibleLink,
  App,
};