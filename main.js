import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Script from 'react-load-script';
import { Loader } from './Loader';

// Set language attribute for accessibility
document.documentElement.lang = 'en';
document.documentElement.dir = 'ltr';

// Merged both sections from separate branches
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Load Screeps library */}
    <Script url="https://cdn.screeps.com/lib/screeps.min.js" onLoad={({ target }) => {
      window.screeps = target;
      root.render(
        <>
          <App />
          {/* Render Loader only when Screeps lib is still loading */}
          {typeof window.screeps === 'undefined' && <Loader />}
        </>
      );
    }} />
    {/* Show loading indicator while the library is loading */}
    <Loader visible={typeof window.screeps === 'undefined'} />
  </React.StrictMode>
);

// Add aria-label to the SVG in metadata:
export const metadata = {
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,...',
        type: 'image/svg+xml',
        // Add aria-hidden for decorative SVG
        'aria-hidden': 'true'
      },
    ],
  },
};

// Add accessibility improvements for the dependency dashboard
function enhanceDashboardAccessibility() {
  // Add ARIA labels to dashboard elements
  const dashboardElements = document.querySelectorAll('.dashboard-section');
  dashboardElements.forEach((section, index) => {
    if (!section.hasAttribute('aria-label')) {
      const sectionTitle = section.querySelector('h2, h3')?.textContent || `Section ${index + 1}`;
      section.setAttribute('aria-label', sectionTitle);
    }
  });

  // Add keyboard navigation support
  const dashboardItems = document.querySelectorAll('.dashboard-item');
  dashboardItems.forEach(item => {
    if (!item.hasAttribute('tabindex')) {
      item.setAttribute('tabindex', '0');
    }
  });
}

// Initialize accessibility enhancements when dashboard content is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.dependency-dashboard')) {
    enhanceDashboardAccessibility();
  }
});