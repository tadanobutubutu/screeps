/**
 * Main application entry point with accessibility improvements
 * Fixes REACT_017 - React Landmarks issue by wrapping content in <main> landmark
 */

// Main Content Component that properly wraps children in a <main> landmark
export function MainContent({ children }) {
  return <main>{children}</main>;
}

// Helper function for creating main elements with additional props
export function createMainElement(children, additionalProps = {}) {
  return <main role="main" {...additionalProps}>{children}</main>;
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

// Preserve all existing exports
export * from './utils';
export * from './components';