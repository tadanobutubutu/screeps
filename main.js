import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming the App component is in the same directory

// Accessibility: Screen reader live region for announcing rotation changes
const createAriaLiveRegion = () => {
  let liveRegion = document.getElementById('rotation-announcer');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'rotation-announcer';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only'; // Standard screen reader class
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.padding = '0';
    liveRegion.style.margin = '-1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';
    document.body.appendChild(liveRegion);
  }
  return liveRegion;
};

const announceRotation = (degrees) => {
  const announcer = createAriaLiveRegion();
  announcer.textContent = degrees === 0 
    ? 'Page rotation has been reset to normal view.' 
    : `Page rotated ${degrees} degrees.`;
};

// Main application logic

document.addEventListener('DOMContentLoaded', () => {
  const unrotateBtn = document.querySelector('[data-unrotate-btn], .unrotate-btn, #unrotate');
  
  if (unrotateBtn) {
    const handleUnrotate = (e) => {
      e.preventDefault();
      // Rotate back logic with accessibility support
      document.body.style.transform = 'rotate(0deg)';
      document.body.style.transition = 'transform 0.3s ease';
      
      // Accessibility: Announce the change to screen readers
      announceRotation(0);
      
      // Accessibility: Restore focus to the button after action
      if (document.activeElement) {
        document.activeElement.blur();
      }
    };
    
    unrotateBtn.addEventListener('click', handleUnrotate);
    
    // Accessibility: Allow keyboard activation
    unrotateBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleUnrotate(e);
      }
    });
  }
  
  // Accessibility: Respect reduced motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handleReducedMotionPreference = () => {
    if (prefersReducedMotion.matches) {
      // Disable or minimize animations for users who prefer reduced motion
      document.body.style.transition = 'none';
    } else {
      document.body.style.transition = 'transform 0.3s ease';
    }
  };
  
  prefersReducedMotion.addEventListener('change', handleReducedMotionPreference);
  handleReducedMotionPreference(); // Initial check
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Export any existing functions
export function someExistingFunction() {
  // Existing functionality
}

export function anotherFunction() {
  // More existing functionality
}

// Accessibility: Export helper function for components to announce changes
export function announceToScreenReader(message) {
  const announcer = createAriaLiveRegion();
  announcer.textContent = message;
}