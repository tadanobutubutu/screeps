// main.js
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
  const container = ...
  const root = createRoot(container);
  root.render(<App />);
}

// Any other existing exports remain unchanged

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Select the unrotate element
  const unrotateElement = document.getElementById('unrotate');
  
  if (unrotateElement) {
    // Replace the <a> element with a <button> element
    const newButton = document.createElement('button');
    newButton.id = 'unrotate';
    newButton.type = 'button';
    newButton.textContent = 'rotate back';
    newButton.className = unrotateElement.className;
    
    // Copy any inline styles if needed
    if (unrotateElement.style.cssText) {
      newButton.style.cssText = unrotateElement.style.cssText;
    }
    
    // Add click handler for the unrotate action
    newButton.addEventListener('click', () => {
      // Your unrotate logic here
      // For example: reset rotation, scroll to top, etc.
      console.log('Rotate back clicked');
    });
    
    // Replace the old element with the new button
    unrotateElement.parentNode.replaceChild(newButton, unrotateElement);
  }
});