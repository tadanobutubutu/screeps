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
    <App />
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

// Add landmark roles for better screen reader navigation
function addLandmarkRoles() {
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.hasAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  const navigation = document.querySelector('nav');
  if (navigation && !navigation.hasAttribute('role')) {
    navigation.setAttribute('role', 'navigation');
  }

  const search = document.querySelector('[role="search"]');
  if (search && !search.hasAttribute('aria-label')) {
    search.setAttribute('aria-label', 'Search');
  }
}

// Add table structure improvements
function improveTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.hasAttribute('role')) {
      table.setAttribute('role', 'table');
    }

    const caption = table.querySelector('caption');
    if (caption && !caption.hasAttribute('id')) {
      const captionId = `caption-${Math.random().toString(36).substring(2, 9)}`;
      caption.setAttribute('id', captionId);
      table.setAttribute('aria-labelledby', captionId);
    }
  });
}

// Add fake link improvements
function improveFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }

    if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
    }
  });
}

// Initialize all accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
  addLandmarkRoles();
  improveTableStructure();
  improveFakeLinks();
});