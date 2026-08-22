// Accessibility improvements have been implemented throughout the codebase

import React from 'react';

function existingFunction() {
  // ... existing code ...
}

export { existingFunction };

function newFunction() {
  // ... new code ...
}

export { newFunction, existingFunction };

export const AppWrapper = ({ lang = 'en', children }) => {
  return (
    <html lang={lang}>
      <body>
        {children}
      </body>
    </html>
  );
};

export const RotateBackButton = ({ onClick }) => {
  return (
    <button id="unrotate" type="button" onClick={onClick} aria-label="rotate back">
      rotate back
    </button>
  );
};

export const FakeLinkAsButton = ({ href, onClick, children, ...props }) => {
  if (href?.startsWith('#') || href === '') {
    return (
      <button type="button" onClick={onClick} aria-label={typeof children === 'string' ? children : undefined} {...props}>
        {children}
      </button>
    );
  }
  return (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  );
};

export const DependencyGraphTable = ({ data }) => {
  const headerIds = data.columns.map((column, index) => `header-${index}`);
  
  return (
    <table>
      <caption style={{ textAlign: 'left' }}>Dependency relationships visualization</caption>
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
              <td key={cellIndex} headers={headerIds[cellIndex]}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const PageLayout = ({ headerContent, mainContent, navContent, footerContent }) => {
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

export const AccessibleIconSVG = ({ ariaLabel, children, role = 'img', ...props }) => {
  return (
    <svg
      aria-label={ariaLabel}
      role={role}
      aria-hidden={ariaLabel ? undefined : true}
      focusable={false}
      {...props}
    >
      {children}
    </svg>
  );
};

export const GraphIcon = (props) => (
  <AccessibleIconSVG ariaLabel="Dependency graph" {...props}>
    {/* SVG path content */}
  </AccessibleIconSVG>
);

export const SettingsIcon = (props) => (
  <AccessibleIconSVG ariaLabel="Settings" {...props}>
    {/* SVG path content */}
  </AccessibleIconSVG>
);

// Fixed: Error state uses <section> instead of duplicate <main> landmark
export const ErrorState = ({ message, onRetry }) => {
  return (
    <section aria-labelledby="error-heading" role="alert">
      <h2 id="error-heading">Error</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </section>
  );
};

// Fixed: Success state uses <main> as the primary landmark
export const SuccessState = ({ data, onEdit }) => {
  return (
    <main id="main-content" role="main">
      <h1>Success</h1>
      <div>{data}</div>
      {onEdit && (
        <button type="button" onClick={onEdit}>
          Edit
        </button>
      )}
    </main>
  );
};

// Fixed: Combined component with proper landmark hierarchy
export const StatusDisplay = ({ status, errorMessage, successData, onRetry, onEdit }) => {
  if (status === 'error') {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }
  
  return <SuccessState data={successData} onEdit={onEdit} />;
};

export const DataViewComponent = ({ hasError, errorContent, content }) => {
  if (hasError) {
    return (
      <section aria-labelledby="error-title" role="alert">
        <h2 id="error-title">Error</h2>
        {errorContent}
      </section>
    );
  }
  
  return (
    <main id="main-content" role="main">
      <h1>Data View</h1>
      {content}
    </main>
  );
};

export { RotateBackButton, FakeLinkAsButton, DependencyGraphTable, AccessibleIconSVG, GraphIcon, SettingsIcon };

export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  return new Date(date).toLocaleDateString('en-US', defaultOptions);
}

export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export const SkipLink = ({ href = '#main-content', children = 'Skip to main content' }) => {
  return (
    <a
      href={href}
      className="skip-link"
      aria-label="Skip to main content"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '0',
        background: '#000',
        color: '#fff',
        padding: '8px',
        zIndex: 100,
        transition: 'top 0.3s'
      }}
    >
      {children}
    </a>
  );
};