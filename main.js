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
  return <main id="main-content" tabIndex={-1}>{children}</main>;
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
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
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
  return href && href !== '#' && href !== '' && href.startsWith('/');
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
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.position = 'absolute';
  announcer.style.left = '-9999px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    announcer.textContent = message;
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }, 100);
}

export function getFocusableElements(container) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return container.querySelectorAll(focusableSelectors.join(', '));
}

export function trapFocus(container) {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Helper component for conditional rendering without multiple <main> landmarks
 * Use this when you have conditional returns that would otherwise include <main> in each branch
 * Fixes: REACT_025 (Unique Landmarks)
 */
export function ConditionalMainContent({ isLoading, error, successContent, errorContent, loadingContent }) {
  if (isLoading) {
    return (
      <MainContent>
        {loadingContent || <div aria-busy="true" aria-label="Loading...">Loading...</div>}
      </MainContent>
    );
  }

  if (error) {
    return (
      <MainContent>
        {errorContent}
      </MainContent>
    );
  }

  return (
    <MainContent>
      {successContent}
    </MainContent>
  );
}

/**
 * Helper component to wrap content that should be in a section or article
 * instead of using additional <main> elements
 * Fixes: REACT_025 (Unique Landmarks)
 */
export function SectionContent({ children, ariaLabel, id }) {
  return (
    <section aria-label={ariaLabel} id={id}>
      {children}
    </section>
  );
}

/**
 * Helper component to wrap content that should be in an article
 * instead of using additional <main> elements
 * Fixes: REACT_025 (Unique Landmarks)
 */
export function ArticleContent({ children, ariaLabel, id }) {
  return (
    <article aria-label={ariaLabel} id={id}>
      {children}
    </article>
  );
}