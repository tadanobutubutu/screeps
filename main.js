import React from "react";
import { icons } from "./path/to/icons";

// Import the required function (adjust the path as needed)
import { someRequiredFunction } from "./someRequiredFunction";

// AppLayout component
const AppLayout = () => {
  // ... (existing code)
};

// Keep the current exports for AppLayout and icons
export { AppLayout, icons };
export default AppLayout;

// Add the new export for the required function
export { someRequiredFunction };

// Function to set the HTML lang attribute for accessibility
export function setLangAttribute(lang = "en") {
  const rootElement = document.documentElement;
  rootElement.setAttribute("lang", lang);
}

// Accessibility utilities for common patterns
const AccessibilityUtils = {
  // Trap focus within an element (for modals, dialogs, etc.)
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex="-1])"
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener("keydown", handleTabKey);
    return () => element.removeEventListener("keydown", handleTabKey);
  },

  // Announce message to screen readers
  announce(message, priority = "polite") {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.style.position = "absolute";
    announcer.style.left = "-9999px";
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Handle escape key for closing overlays
  handleEscapeKey(callback) {
    const handler = (e) => {
      if (e.key === "Escape") {
        callback();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  },

  // Set up keyboard navigation for custom components
  setupKeyboardNavigation(items, options = {}) {
    const { onSelect, wrap = true } = options;
    let currentIndex = 0;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          currentIndex = wrap
            ? (currentIndex + 1) % items.length
            : Math.min(currentIndex + 1, items.length - 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          currentIndex = wrap
            ? (currentIndex - 1 + items.length) % items.length
            : Math.max(currentIndex - 1, 0);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onSelect(items[currentIndex], currentIndex);
          break;
        case "Home":
          e.preventDefault();
          currentIndex = 0;
          break;
        case "End":
          e.preventDefault();
          currentIndex = items.length - 1;
          break;
        default:
          return;
      }
      items[currentIndex]?.focus();
    };

    return { handleKeyDown, setIndex: (index) => { currentIndex = index; } };
  }
};

// Initialize accessibility features
function initializeAccessibility() {
  // Ensure skip link functionality
  const skipLink = document.querySelector('a[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      const targetId = skipLink.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }

  // Add reduced motion support
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.documentElement.setAttribute("data-reduced-motion", prefersReducedMotion.matches);
  prefersReducedMotion.addEventListener("change", (e) => {
    document.documentElement.setAttribute("data-reduced-motion", e.matches);
  });

  // Set default language attribute
  setLangAttribute("en");
}

// Export for use in other modules
export { AccessibilityUtils, initializeAccessibility };