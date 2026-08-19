import React from 'react';

const Main = () => {
  return (
    <div lang="en">
      <main>
        <div className="container">
          <h2>Quality & Metrics Reports</h2>
          <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
          <div className="links">
            <a href="/code-complexity">Code Complexity Report</a>
            <a href="/dependency-graph" id="dependencyGraphLink">Dependency Graph</a>
            <RotateBackButton id="unrotate" />
            {/* Incorporated the new RotateBackButton component */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;

function RotateBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button id="unrotate" onClick={onClick} aria-label="Rotate back to original orientation">
      rotate back
    </button>
  );
}

// For a component with tables, use proper table structure: // Use semantic landmarks instead of just divs with role="banner", etc. // Add accessibility utilities export const skipToContentId = 'skip-to-content'; export function SkipToContentLink() {
  return (
    <a href={`#${skipToContentId}`} className="skip-link">Skip to main content</a>
  );
}

export function FocusTrap({ children }) {
  return (
    <div className="focus-trap" tabIndex="-1">
      {children}
    </div>
  );
}

export function useKeyboardNavigation(ref, items) {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      // Implement navigation logic
    }
  };
  return { handleKeyDown };
}

// Add screen reader utilities export function ScreenReaderOnly({ children }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Add ARIA live region utilities export function LiveRegion({ children, ariaLive = 'polite' }) {
  return (
    <div aria-live={ariaLive} className="live-region">
      {children}
    </div>
  );
}