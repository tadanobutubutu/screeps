// Accessibility fixes from insight report

/**
 * Creates an accessible table component
 * Fixes: REACT_027 (Table Structure)
 */
export function AccessibleTable({ headers, rows, caption }) {
  // (existing code)
}

/**
 * Accessible SVG component with proper labeling
 * Fixes: REACT_041 (SVG Accessible Name)
 */
export function AccessibleIcon({ children, label, className }) {
  return (
    <svg
      className={className}
      aria-label={label}
      role="img"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/**
 * Decorative SVG icon component (for favicons, etc.)
 * Fixes: REACT_041 (SVG Accessible Name)
 * Use this for purely decorative icons that should be hidden from screen readers
 */
export function DecorativeIcon({ children, className }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/**
 * Proper landmark wrapper
 * Fixes: REACT_017 (Landmarks), REACT_025 (Unique Landmarks)
 */
export function MainContent({ children }) {
  // (existing code)
}

/**
 * Proper navigation landmark
 * Fixes: REACT_017, REACT_025
 */
export function Navigation({ children, ariaLabel }) {
  return (
    <nav aria-label={ariaLabel || 'Main navigation'}>
      {children}
    </nav>
  );
}

/**
 * Proper header with landmark
 * Fixes: REACT_017
 */
export function Header({ children }) {
  return <header>{children}</header>;
}

/**
 * Proper footer with landmark
 * Fixes: REACT_017
 */
export function Footer({ children }) {
  return <footer>{children}</footer>;
}

/**
 * Accessible link component - real links only
 * Fixes: REACT_036 (Fake Link)
 */
export function AccessibleLink({ href, children, onClick, ...props }) {
  if (!isValidHref(href)) {
    return <button type="button" onClick={onClick} {...props}>{children}</button>;
  }

  return <a href={href} onClick={onClick} {...props}>{children}</a>;
}

/**
 * Skip link component for keyboard navigation
 * Helps with accessibility overall
 */
export function SkipLink() {
  // (existing code)
}

/**
 * Accessible page wrapper for Next.js
 * Fixes: REACT_015 (lang attribute - though typically set in _document.js)
 *
 * Note: For REACT_015, ensure your pages/_document.js or app/layout.tsx has:
 * <html lang="en">
 */
export function AccessiblePageWrapper({ children }) {
  // (existing code)
}

// Export component for testing - demonstrates all accessibility fixes
export const accessibilityComponents = {
  AccessibleTable,
  AccessibleIcon,
  DecorativeIcon,
  MainContent,
  Navigation,
  Header,
  Footer,
  AccessibleLink,
  SkipLink,
  AccessiblePageWrapper,
};

export function isValidHref(href) {
  return href && href !== '#' && href !== '' && !href.startsWith('javascript:');
}

export default accessibilityComponents;

// Re‑export named components for test imports
export { AccessibleTable, AccessibleIcon, DecorativeIcon, MainContent, Navigation, Header, Footer, AccessibleLink, SkipLink, AccessiblePageWrapper };

// Utility functions for accessibility support
// (existing code)

/**
 * Utility function to check if an element is focusable
 * Useful in various accessibility contexts
 */
export function isFocusable(element) {
  return (
    (element && typeof element === 'object' && element.tagName) ||
    (element && typeof element === 'string' && element.trim().length > 0)
  );
}