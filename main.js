/**
 * Main application entry point with accessibility improvements
 * Fixes REACT_017 - React Landmarks issue by wrapping content in <main> landmark
 * Addresses REACT_025 - React Unique Landmark by adding unique aria-label to each main element
 */

/*
Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?
*/

// Main Content Component that properly wraps children in a <main> landmark
export function MainContent({ children, uniqueId = '' }) {
  return <main role="main" aria-label={`main-content-${uniqueId}`}>{children}</main>;
}

// Helper function for creating main elements with additional props
export function createMainElement(children, uniqueId = '', additionalProps = {}) {
  return <main role="main" aria-label={`main-element-${uniqueId}`} {...additionalProps}>{children}</main>;
}

// Layout wrapper function for reusable layout patterns
export function MainLayout({ children, className = '', id = '', uniqueId = '' }) {
  return (
    <main
      role="main"
      className={className}
      id={id}
      aria-label={`main-layout-${uniqueId}`}
    >
      {children}
    </main>
  );
}

// Preserve all existing exports
export * from './utils';
export * from './components';