import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set language attribute for accessibility
document.documentElement.lang = 'en';

// Update th tags with scope attribute
function updateThTags() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

// Call update function when DOM is loaded
document.addEventListener('DOMContentLoaded', updateThTags);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);

// Add aria-label to the SVG in metadata:
export const metadata = {
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,...',
        type: 'image/svg+xml',
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