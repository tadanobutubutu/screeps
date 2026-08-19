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

// Add helper component for accessible SVGs
const AccessibleSvg = ({ children, ...props }) => {
  return (
    <svg aria-hidden="true" {...props}>
      {children}
    </svg>
  );
};

// Export the helper component for use in layout files
export { AccessibleSvg };