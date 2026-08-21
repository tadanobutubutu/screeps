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
 * Proper landmark wrapper
 * Fixes: REACT_017 (Landmarks), REACT_025 (Unique Landmarks)
 */
export function MainContent({ children }) {
  return <main id="main-content">{children}</main>;
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
export function AccessibleLink({ href, children, onClick }) {
  // If href exists and is a real destination, use <a>
  if (href && href !== '#' && href !== '') {
    return <a href={href} onClick={onClick}>{children}</a>;
  }
  // If no href or fake href, use <button> instead
  return <button type="button" onClick={onClick}>{children}</button>;
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
  MainContent,
  Navigation,
  Header,
  Footer,
  AccessibleLink,
  SkipLink,
  AccessiblePageWrapper,
};

export default accessibilityComponents;

// Re‑export named components for test imports
export { AccessibleTable, AccessibleIcon, MainContent, Navigation, Header, Footer, AccessibleLink, SkipLink, AccessiblePageWrapper };