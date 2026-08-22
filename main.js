import React from 'react';

// Ensure unique landmarks across the application
export function ensureUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="main"], [role="contentinfo"], header, nav, main, footer');
  const seenIds = new Set();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const existingId = landmark.id;
    if (existingId && !seenIds.has(existingId)) {
      seenIds.add(existingId);
    } else {
      let counter = 1;
      let newId = `${role}-${counter}`;
      while (seenIds.has(newId)) {
        counter++;
        newId = `${role}-${counter}`;
      }
      landmark.id = newId;
      seenIds.add(newId);
    }
  });
  return container;
}

// Enhance focus visibility for keyboard navigation
export function enhanceFocusVisibility() {
  // Implementation can be added here if needed
}

// Add lang attribute to HTML element
export function setHtmlLang(lang) {
  if (lang) {
    document.documentElement.lang = lang;
    return true;
  }
  return false;
}

// Helper to set language attribute globally
export function setLanguageAttribute(lang) {
  document.documentElement.lang = lang;
}

// Calculate average of an array of numbers
export function calculateAverage(numbers) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

// Generate a unique identifier
export function generateId(prefix = 'id') {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  return `${prefix}-${timestamp}-${randomPart}`;
}

// FakeLinkAsButton component
export const FakeLinkAsButton = ({ href, onClick, children, ...props }) => {
  // If href starts with # or is JavaScript-dependent, use button
  if (href?.startsWith('#') || href === '') {
    return (
      <button 
        type="button"
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  } else {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }
};

// DependencyGraphTable component
export const DependencyGraphTable = ({ data }) => {
  return (
    <table>
      <caption style={{ textAlign: 'left' }}>
        Dependency relationships visualization
      </caption>
      <thead>
        <tr>
          {data.columns.map((column, index) => (
            <th key={index} id={`header-${index}`} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => (
              <td key={cellIndex} headers={cell.headerId}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// fixTableStructureIssues utility
export function fixTableStructureIssues(tables) {
  return tables.map((table, tableIndex) => ({
    ...table,
    caption: table.caption || `Table ${tableIndex + 1}`,
    hasHeaderRow: table.hasHeaderRow !== false,
    headers: table.headers || []
  }));
}

// StatusPage component with single main landmark
export const StatusPage = ({ status, errorMessage, successContent, isLoading }) => {
  return (
    <main id="main-content" role="main" aria-live="polite">
      {isLoading && (
        <div className="loading-state" role="status" aria-busy="true">
          Loading...
        </div>
      )}
      {status === 'error' && (
        <article className="error-state" role="alert">
          <h1>Error</h1>
          <p>{errorMessage || 'An error occurred'}</p>
        </article>
      )}
      {status === 'success' && (
        <article className="success-state">
          <h1>Success</h1>
          {successContent}
        </article>
      )}
    </main>
  );
};

// ContentPanel component using section for nested usage
export const ContentPanel = ({ type, title, content, errorContent }) => {
  if (type === 'error') {
    return (
      <section 
        id="error-panel" 
        aria-labelledby="error-title"
        className="error-panel"
      >
        <h2 id="error-title">Error</h2>
        {errorContent}
      </section>
    );
  }
  return (
    <section 
      id="content-panel"
      aria-labelledby="content-title"
      className="content-panel"
    >
      <h2 id="content-title">{title}</h2>
      {content}
    </section>
  );
};

// PageLayout component with unique landmarks
export const PageLayout = ({ 
  headerContent, 
  mainContent, 
  navContent, 
  footerContent   
}) => {
  return (
    <>
      <header id="site-header" role="banner">
        {headerContent}
      </header>
      
      <nav id="main-navigation" role="navigation" aria-label="Main navigation">
        {navContent}
      </nav>
      
      <main id="main-content" role="main">
        {mainContent}
      </main>
      
      <footer id="site-footer" role="contentinfo">
        {footerContent}
      </footer>
    </>
  );
};

// AccessibleIconSVG component with optional role and ariaLabel
export const AccessibleIconSVG = ({ ariaLabel, children, role = 'img', ...props }) => {
  return (
    <svg 
      aria-label={ariaLabel}
      role={role}
      aria-hidden={ariaLabel ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  );
};

export const GraphIcon = (props) => (
  <AccessibleIconSVG 
    ariaLabel="Dependency graph" 
    {...props}
  >
    {/* SVG path content */}
  </svg>
);

export const SettingsIcon = (props) => (
  <AccessibleIconSVG 
    ariaLabel="Settings" 
    {...props}
  >
    {/* SVG path content */}
  </svg>
);

// createAccessibleFaviconSvg utility
export function createAccessibleFaviconSvg({ 
  title, 
  children, 
  viewBox = '0 0 100 100',
  xmlns = 'http://www.w3.org/2000/svg'
}) {
  const svgContent = `<svg xmlns="${xmlns}" viewBox="${viewBox}" role="img" aria-labelledby="favicon-title-${title.replace(/\s+/g, '-').toLowerCase()}"><title id="favicon-title-${title.replace(/\s+/g, '-').toLowerCase()}">${title}</title>${children}</svg>`;
  const encoded = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encoded}`;
}

// Predefined favicon generators
export const faviconGenerators = {
  screepsDashboard: () => createAccessibleFaviconSvg({
    title: 'Screeps Dashboard',
    children: '<text y=".9em" x="50%" text-anchor="middle" font-size="80">📊</text>'
  }),
  screepsBug: () => createAccessibleFaviconSvg({
    title: 'Screps Bug Icon',
    children: '<text y=".9em" x="50%" text-anchor="middle" font-size="80">🐛</text>'
  })
};

// AppWrapper component that sets lang attribute on wrapper
export const AppWrapper = ({ lang, children }) => {
  return (
    <div lang={lang}>
      {children}
    </div>
  );
};

// HtmlLangProvider component to set lang attribute on HTML root element
export const HtmlLangProvider = ({ lang, children }) => {
  React.useEffect(() => {
    if (lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);
  return children;
};

// addressAccessibilityIssues function to handle multiple accessibility tasks
export function addressAccessibilityIssues() {
  // Add lang attribute to HTML element
  document.documentElement.lang = 'en';

  // Enhance focus visibility
  enhanceFocusVisibility();

  // Ensure unique landmarks
  ensureUniqueLandmarks(document.body);
}

// Export all components and utilities
export { 
  FakeLinkAsButton,
  DependencyGraphTable,
  AccessibleIconSVG,
  GraphIcon,
  SettingsIcon,
  AppWrapper,
  HtmlLangProvider,
  PageLayout,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  createAccessibleFaviconSvg,
  faviconGenerators,
  StatusPage,
  ContentPanel,
  generateId,
  setHtmlLang,
  setLanguageAttribute,
  calculateAverage,
  addressAccessibilityIssues,
  enhanceFocusVisibility
};