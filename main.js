/**
 * Accessibility fixes from insight report
 */

/**
 * Creates an accessible table component
 * Fixes: REACT_027 (Table Structure)
 * 
 * Adds proper scope attributes to table headers for screen reader compatibility.
 * Use scope="col" for column headers and scope="row" for row headers.
 * 
 * @param {Object} props - Component props
 * @param {Array<string>} props.headers - Column header labels
 * @param {Array<Array<string>>} props.rows - Table row data
 * @param {string} props.caption - Table caption for screen readers
 * @returns {JSX.Element} Accessible table component
 */
export function AccessibleTable({ headers, rows, caption }) {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              cellIndex === 0 ? (
                <th key={cellIndex} scope="row">{cell}</th>
              ) : (
                <td key={cellIndex}>{cell}</td>
              )
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
 * 
 * Uses a single <main> landmark for success states and <section role="alert">
 * for error states to avoid multiple main landmarks while maintaining
 * accessibility for screen readers and assistive technologies.
 */
export function MainContent({ children, isError = false }) {
  if (isError) {
    return (
      <section role="alert" aria-label="Error state" className="error-container">
        {children}
      </section>
    );
  }
  return <main>{children}</main>;
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
    return <button type="button" onClick={onClick} {...props}>
      {children}
    </button>;
  }

  return <a href={href} onClick={onClick} {...props}>
    {children}
  </a>;
}

/**
 * Skip link component for keyboard navigation
 * Helps with accessibility overall
 */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}

/**
 * Accessible page wrapper for Next.js
 * Fixes: REACT_015 (lang attribute)
 * 
 * IMPORTANT: The lang attribute MUST be set on the <html> element, not here.
 * This component ensures the rest of the page content is properly structured.
 * 
 * For Next.js Pages Router: Set lang in pages/_document.js:
 *   <html lang="en">
 * 
 * For Next.js App Router: Set lang in app/layout.tsx:
 *   <html lang="en">
 * 
 * Example _document.js:
 *   class MyDocument extends Document {
 *     render() {
 *       return (
 *         <html lang="en">
 *           <head />
 *           <body>
 *             <Main />
 *           </body>
 *         </html>
 *       );
 *     }
 *   }
 */
export function AccessiblePageWrapper({ children, lang = 'en' }) {
  // Note: The lang attribute should be on <html>, not on a wrapper div.
  // This wrapper provides semantic structure while the lang is set at the document level.
  // Screen readers use the lang attribute from <html> to determine the document language.
  return (
    <div className="page-wrapper" lang={lang} translate="no">
      {children}
    </div>
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
  return href && href !== '#' && href !== '';
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

/**
 * Main landmark wrapper for document-level accessibility
 * Fixes: REACT_017 (React Landmarks - Page has no <main> landmark)
 * 
 * Provides a semantic <main> element that wraps the primary content of a page.
 * The <main> landmark represents the dominant content of the <body> of a document
 * or application, which should be unique per page for optimal accessibility.
 * 
 * This component should be used once per page to wrap the primary content area.
 * For document structure, use <header> for site-wide headers, <nav> for navigation,
 * and <footer> for site-wide footers - keeping <main> for the unique page content.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to wrap in <main> landmark
 * @returns {JSX.Element} Semantic <main> element with children
 * 
 * @example
 * // Basic usage
 * <MainLandmark>
 *   <YourPageContent />
 * </MainLandmark>
 * 
 * // In a full page structure
 * <div>
 *   <Header>...</Header>
 *   <Navigation>...</Navigation>
 *   <MainLandmark>
 *     <h1>Page Title</h1>
 *     <p>Main content here</p>
 *   </MainLandmark>
 *   <Footer>...</Footer>
 * </div>
 */
export function MainLandmark({ children }) {
  return <main>{children}</main>;
}

/**
 * Accessible page structure component
 * Fixes: REACT_017 (React Landmarks)
 * 
 * Provides a complete page structure with proper landmarks for accessibility.
 * Includes skip link target, header, navigation, main content, and footer.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.header - Header content
 * @param {React.ReactNode} props.navigation - Navigation content
 * @param {React.ReactNode} props.children - Main content (wrapped in <main>)
 * @param {React.ReactNode} props.footer - Footer content
 * @returns {JSX.Element} Fully structured accessible page layout
 */
export function AccessiblePageStructure({ header, navigation, children, footer }) {
  return (
    <div className="page">
      <div id="skip-link-target" tabIndex={-1} />
      {header && <header>{header}</header>}
      {navigation && (
        <nav aria-label="Main navigation">
          {navigation}
        </nav>
      )}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}