// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

import React from 'react';

export function AccessibilityExample() {
  // REACT_025: Add proper ARIA labels and semantic HTML
  return (
    <main role="main" aria-label="Main content">
      <h1>Welcome to Our Application</h1>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/" aria-current="page">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </main>
  );
}

export function AccessibleButton({ onClick, children, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

export function AccessibleForm({ onSubmit, children }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Form">
      {children}
    </form>
  );
}

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
      onFocus={(e) => {
        e.currentTarget.style.position = 'static';
        e.currentTarget.style.width = 'auto';
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.padding = '10px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.position = 'absolute';
        e.currentTarget.style.left = '-9999px';
        e.currentTarget.style.width = '1px';
        e.currentTarget.style.height = '1px';
      }}
    >
      Skip to main content
    </a>
  );
}

export function LiveRegion({ message, politeness = 'polite' }) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="visually-hidden"
    >
      {message}
    </div>
  );
}

// Helper function to manage focus for accessibility
export function manageFocus(elementRef) {
  if (elementRef && elementRef.current) {
    elementRef.current.focus();
  }
}

// Check color contrast (WCAG AA standard minimum 4.5:1 for normal text)
export function checkColorContrast(foregroundColor, backgroundColor) {
  const getLuminance = (color) => {
    const rgb = color.match(/\w\w/g).map(x => {
      const hex = parseInt(x, 16);
      return hex / 255;
    });
    const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foregroundColor);
  const l2 = getLuminance(backgroundColor);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const contrast = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: contrast.toFixed(2),
    passesAA: contrast >= 4.5,
    passesAAA: contrast >= 7
  };
}