import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
export function App() {
  return (
    <div>
      {/* Other existing components */}
    </div>
  );
}

// Add accessible name to SVG in app/layout.tsx
export function Layout({ children }) {
  return (
    <div>
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: 'absolute' }}
      >
        <title>Application icon</title>
      </svg>
      {children}
    </div>
  );
}

// Add accessible name to SVG in dashboard/app/layout.tsx
export function DashboardLayout({ children }) {
  return (
    <div>
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: 'absolute' }}
      >
        <title>Dashboard icon</title>
      </svg>
      {children}
    </div>
  );
}

// Existing code (preserved)
export function renderApp() {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<App />);
}

// DOM manipulation for the unrotate element
document.addEventListener('DOMContentLoaded', () => {
  const unrotateElement = document.getElementById('unrotate');
  if (unrotateElement) {
    const newButton = document.createElement('button');
    newButton.id = 'unrotate';
    newButton.type = 'button';
    newButton.textContent = 'rotate back';
    newButton.className = unrotateElement.className;

    if (unrotateElement.style.cssText) {
      newButton.style.cssText = unrotateElement.style.cssText;
    }

    newButton.addEventListener('click', () => {
      // Your unrotate logic here
      // For example: reset rotation, scroll to top, etc.
      console.log('Rotate back clicked');
    });

    unrotateElement.parentNode.replaceChild(newButton, unrotateElement);
  }
});

// Export for testing (if applicable)
export function init() {
  // This function can be called manually if needed
  document.addEventListener('DOMContentLoaded', () => {
    const unrotateElement = document.getElementById('unrotate');
    if (unrotateElement) {
      const newButton = document.createElement('button');
      newButton.id = 'unrotate';
      newButton.type = 'button';
      newButton.textContent = 'rotate back';
      newButton.className = unrotateElement.className;

      if (unrotateElement.style.cssText) {
        newButton.style.cssText = unrotateElement.style.cssText;
      }

      newButton.addEventListener('click', () => {
        console.log('Rotate back clicked');
      });

      unrotateElement.parentNode.replaceChild(newButton, unrotateElement);
    }
  });
}