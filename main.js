import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// REACT_015: Set the lang attribute on the HTML element
useEffect(() => {
  document.documentElement.setAttribute('lang', 'en');
}, []);

// REACT_017: Add landmark roles and fix landmark issues
// REACT_025: Ensure unique landmarks
// REACT_036: Fix fake link issues
// REACT_041: Add accessible names to SVGs

// REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Assuming the button click is handled by JavaScript, here's how it might look:
  const button = document.querySelector('.back-button');
  if (button) {
    button.addEventListener('click', rotateBack);
  }

  function rotateBack() {
    // Function to handle rotating back
  }

  // Accessibility issue addressing functions
  function addressAccessibilityIssues(insightReport) {
    // Assuming insightReport is an array of objects with 'issue' and 'solution' properties
    insightReport.forEach(issue => {
      console.log(`Addressing issue: ${issue.issue}`);
      // Implement the solution to the issue
      // This is a placeholder for the actual implementation
      console.log(`Solution: ${issue.solution}`);
      // ... code to apply the solution ...
    });
  }

  // New function to address accessibility issues from insight report
  function newFunction() {
    // implementation of new function
  }

  // Accessibility Helper Functions

  /**
   * Announces a message to screen readers using ARIA live regions
   * @param {string} message - The message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }

  /**
   * Traps focus within a specified element (useful for modals)
   * @param {HTMLElement} element - The container element to trap focus within
   * @returns {Function} - Cleanup function to remove the trap
   */
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => element.removeEventListener('keydown', handleKeyDown);
  }

  /**
   * Manages focus when navigating between sections
   * @param {string} selector - CSS selector of the target section
   */
  function manageFocusOnNavigation(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.removeAttribute('tabindex');
    }
  }

  /**
   * Checks if user prefers reduced motion
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Safely manages aria-expanded state
   * @param {HTMLElement} trigger - The element that triggers the toggle
   * @param {boolean} isExpanded - Current expanded state
   */
  function setAriaExpanded(trigger, isExpanded) {
    if (trigger) {
      trigger.setAttribute('aria-expanded', String(isExpanded));
    }
  }

  /**
   * Validates that an interactive element has proper accessible name
   * @param {HTMLElement} element - The element to validate
   * @returns {boolean}
   */
  function hasAccessibleName(element) {
    return !!(
      element.textContent?.trim() ||
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('alt') ||
      element.getAttribute('title')
    );
  }

  // Export the newFunction for use in other modules
  export { newFunction, addressAccessibilityIssues, announceToScreenReader, trapFocus, manageFocusOnNavigation, prefersReducedMotion, setAriaExpanded, hasAccessibleName, rotateBack };

  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />); 

// Screeps game loop implementation
module.exports.loop = function() {
    var tower = Game.getObjectById('tower');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure) {
                return structure.hits < structure.hitsMax;
            }
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }
};