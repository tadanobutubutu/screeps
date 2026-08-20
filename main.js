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

// Add specific improvement for the rotate back link
function improveRotateBackLink() {
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    // Replace href="#" with a proper button element
    const button = document.createElement('button');
    button.id = rotateBackLink.id;
    button.textContent = rotateBackLink.textContent;
    button.className = rotateBackLink.className;

    // Copy any event listeners
    const listeners = getEventListeners(rotateBackLink);
    if (listeners && listeners.click) {
      listeners.click.forEach(listener => {
        button.addEventListener('click', listener.listener);
      });
    }

    // Replace the link with the button
    rotateBackLink.parentNode.replaceChild(button, rotateBackLink);
  }
}

// Add ARIA attributes to form elements
function enhanceFormAccessibility() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    if (!form.hasAttribute('role')) {
      form.setAttribute('role', 'form');
    }

    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (!input.hasAttribute('aria-required') && input.required) {
        input.setAttribute('aria-required', 'true');
      }

      if (!input.hasAttribute('aria-invalid') && input.validity && input.validity.valid === false) {
        input.setAttribute('aria-invalid', 'true');
      }
    });
  });
}

// Add skip to content link for keyboard users
function addSkipToContentLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-9999px';
  skipLink.style.top = '0';
  skipLink.style.width = '1px';
  skipLink.style.height = '1px';
  skipLink.style.overflow = 'hidden';
  skipLink.style.zIndex = '100';

  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
    skipLink.style.width = 'auto';
    skipLink.style.height = 'auto';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize all accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
  addLandmarkRoles();
  improveTableStructure();
  improveFakeLinks();
  enhanceFormAccessibility();
  addSkipToContentLink();
  improveRotateBackLink(); // Add the new function call
});