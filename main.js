// This is a common Next.js main.js/_app.js pattern with accessibility fixes

// Ensure you have lang attribute in your _document.js or _app.js
// For pages/_app.js:
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

// For pages/_document.js (add lang attribute):
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">  {/* REACT_015 fix */}
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// For a component with tables, use proper table structure:
// Use semantic landmarks instead of just divs with role="banner", etc.

// Add accessibility utilities
export const skipToContentId = 'skip-to-content';

export function SkipToContentLink() {
  return (
    <a href={`#${skipToContentId}`} className="skip-link">
      Skip to main content
    </a>
  );
}

// Add focus management utilities
export function FocusTrap({ children }) {
  return (
    <div className="focus-trap" tabIndex="-1">
      {children}
    </div>
  );
}

// Add keyboard navigation utilities
export function useKeyboardNavigation(ref, items) {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      // Implement navigation logic
    }
  };

  return { handleKeyDown };
}

// Add screen reader utilities
export function ScreenReaderOnly({ children }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Add ARIA live region utilities
export function LiveRegion({ children, ariaLive = 'polite' }) {
  return (
    <div aria-live={ariaLive} className="live-region">
      {children}
    </div>
  );
}