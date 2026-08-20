/**
 * Main application entry point with accessibility improvements
 * Fixes REACT_017 - React Landmarks issue by wrapping content in <main> landmark
 * Fixes REACT_025 - React Unique Landmarks by providing section/article helpers
 */

// Main Content Component that properly wraps children in a <main> landmark
export function MainContent({ children }) {
  return <main ...
}

// Helper function for creating main elements with additional props
export function createMainElement(children, additionalProps = {}) {
  return <main role="main" ...
}

// Layout wrapper function for reusable layout patterns
export function MainLayout({ children, className = '', id = '' }) {
  return (
    <main 
      role="main" 
      className={className} 
      id={id}
    >
      {children}
    </main>
  );
}

// Helper function for creating section elements within main landmark
// Use this for logical content divisions instead of additional <main> elements
export function createSectionElement(children, additionalProps = {}) {
  return <section {...additionalProps}>{children}</section>;
}

// Helper function for creating article elements within main landmark
// Use this for self-contained content sections instead of additional <main> elements
export function createArticleElement(children, additionalProps = {}) {
  return <article {...additionalProps}>{children}</article>;
}

// Preserve all existing exports
export * from './utils';
export * from './components';