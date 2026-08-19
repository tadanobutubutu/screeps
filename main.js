import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <Layout>
      {/* Favicon SVG with aria-hidden */}
      <svg
        aria-hidden="true"
        style={{ display: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <title>Favicon</title>
        <circle cx="50" cy="50" r="40" fill="#61dafb" />
      </svg>

      {/* Main content */}
      <h1>Welcome to the App</h1>
      <p>This is a React application.</p>
    </Layout>
  );
}

// Added for accessibility
export default function Layout({ children }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const handleLoad = function () {
        const appLayoutSvg = document.querySelector('app-layout svg');
        if (appLayoutSvg) {
          appLayoutSvg.setAttribute('aria-label', 'Application icon');
        }

        const dashboardLayoutSvg = document.querySelector('dashboard-app-layout svg');
        if (dashboardLayoutSvg) {
          dashboardLayoutSvg.setAttribute('aria-label', 'Dashboard icon');
        }
      };

      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header role="banner">
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content" role="main">
        {children}
      </main>

      <footer role="contentinfo">
        <nav aria-label="Footer navigation">
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </nav>
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Export all existing functions if any
export { /* existing exports */ };
```