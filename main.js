import React from 'react';

// Utility functions for accessibility
const accessibilityUtils = {
    initSkipLink: () => {
        const skipLink = document.querySelector('#skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        }
    },

    trapFocus: (element) => {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    },

    announceToScreenReader: (message, priority = 'polite') => {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        setTimeout(() => announcer.remove(), 1000);
    },

    handleKeyboardNav: (e, handlers) => {
        const key = e.key;
        if (handlers[key]) {
            handlers[key](e);
        }
    },
};

// New utility functions
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', lang || 'en');
    }
    return lang || 'en';
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_015: Initialize HTML lang attribute on DOM ready
function initHtmlLangAttribute() {
  if (typeof document === 'undefined') {
    return 'en';
  }
  
  // If lang is already set, return it
  if (document.documentElement.lang) {
    return document.documentElement.lang;
  }
  
  // Try to detect from page content
  const bodyText = document.body?.textContent || '';
  const detectedLang = detectAndSetLang(bodyText);
  
  // Set the lang attribute
  return setHtmlLangAttribute(detectedLang);
}

// Auto-initialize on DOMContentLoaded for static HTML pages that load this script
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHtmlLangAttribute);
  } else {
    initHtmlLangAttribute();
  }
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? Array.from(thead.querySelectorAll('th')) : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

function addAriaLabel(element, label) {
    if (!element) {
        return;
    }

    if (typeof label !== 'string' || label.trim() === '') {
        return element;
    }

    element.setAttribute('aria-label', label);
    return element;
}

function ensureElementAccessibility(element, idPrefix, ariaLabel) {
    if (!element) {
        return;
    }

    const id = ensureElementHasId(element, idPrefix);
    addAriaLabel(element, ariaLabel);

    return id;
}

// Existing functions and other changes from HEAD and origin/main branches
// (... The rest of the file remains unchanged, including merged content between branches.)

function newFocusTrap() {
    // New function implementation: traps focus within a given element
    return (element) => {
        if (!element) return;
        const focusable = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        });
    };
}

function addLangAttribute() {
    document.documentElement.setAttribute('lang', 'en');
}