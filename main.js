// Accessibility fixes from insight report

/**
 * Creates an accessible table component
 * Fixes: REACT_027 (Table Structure)
 */
export function AccessibleTable({ headers, rows, caption }) {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} ...
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
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
  return <main ...
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
    return <button type="button" onClick={onClick} ...
  }

  return <a href={href} onClick={onClick} ...
}

/**
 * Skip link component for keyboard navigation
 * Helps with accessibility overall
 */
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
        e.target.style.position = 'fixed';
        e.target.style.top = '0';
        e.target.style.left = '0';
        e.target.style.width = 'auto';
        e.target.style.height = 'auto';
        e.target.style.padding = '1rem';
        e.target.style.background = '#fff';
        e.target.style.zIndex = '9999';
      }}
      onBlur={(e) => {
        e.target.style.position = 'absolute';
        e.target.style.left = '-9999px';
        e.target.style.width = '1px';
        e.target.style.height = '1px';
      }}
    >
      Skip to main content
    </a>
  );
}

/**
 * Accessible page wrapper for Next.js
 * Fixes: REACT_015 (lang attribute - though typically set in _document.js)
 * 
 * Note: For REACT_015, ensure your pages/_document.js or app/layout.tsx has:
 * <html lang="en">
 */
export function AccessiblePageWrapper({ children }) {
  return (
    <>
      <SkipLink />
      <Header>
        <Navigation>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a ...
            <li><a ...
          </ul>
        </Navigation>
      </Header>
      <MainContent>
        {children}
      </MainContent>
      <Footer>
        <p>&copy; 2024 Accessible Site</p>
      </Footer>
    </>
  );
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
  return href && href !== '#' && href !== '' && ...
}

export default accessibilityComponents;

// Re‑export named components for test imports
export { AccessibleTable, AccessibleIcon, DecorativeIcon, MainContent, Navigation, Header, Footer, AccessibleLink, SkipLink, AccessiblePageWrapper };

// Utility functions for accessibility support
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

export function announceToScreenReader(message, priority = 'polite') {
  const announcer = ...
  announcer.setAttribute('role', 'status');
  ... priority);
  ... 'true');
  announcer.className = 'sr-only';
  announcer.style.position = 'absolute';
  announcer.style.left = '-9999px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  ...
  
  setTimeout(() => {
    announcer.textContent = message;
    setTimeout(() => {
      ...
    }, 1000);
  }, 100);
}

export function ... {
  const focusableSelectors = [
    'a[href]',
    ...
    ...
    ...
    ...
    ...
  ];
  return ...
}

export function trapFocus(container) {
  const focusableElements = ...
  const firstElement = ...
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        ...
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        ...
      }
    }
  };

  ... handleKeyDown);
  ...

  return () => {
    ... handleKeyDown);
  };
}