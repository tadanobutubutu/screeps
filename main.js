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

// Helper function to create accessible buttons for in-page actions
export function createAccessibleButton({
  id,
  onClick,
  children,
  className = '',
  type = 'button'
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={className}
      type={type}
      aria-label={children}
    >
      {children}
    </button>
  );
}