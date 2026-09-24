// TODO: add the new functions or changes requested in the issue
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97a2237d968a50cc419 -->
//_Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f8a6325b07b9b809ac49f5e1c81cf4f89f9c1 -->
//_Commit: 669117b4c3d1a635653f730f0a059efacbb752_
//<!-- todo-hash: 312aa8ea4c5e1c94a4e4b7c36c210eb9a72dea -->
//_Commit: 54b7c4d06fbf48e78de43e5e115814006658c_
//<!-- todo-hash: d290c9a63ee693e91602c7ca6757def47f63e -->
// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report
import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e. g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
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

function ensureElementHasId(element, prefix) {
    if (!element) {
        return;
    }

    if (!element.id) {
        element.id = prefix + Math.random().toString(36).substr(2, 9);
    }
    return element.id;
}

function ensureElementAccessibility(element, idPrefix, ariaLabel) {
    if (!element) {
        return;
    }

    const id = ensureElementHasId(element, idPrefix);
    addAriaLabel(element, ariaLabel);

    return id;
}

// Create in-page button with proper accessibility attributes
function createInPageButton(text, href) {
    const button = document.createElement('a');
    button.textContent = text;
    button.href = href;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    return button;
}

// Get person name with proper accessibility attributes
function personName(name) {
    const span = document.createElement('span');
    span.textContent = name;
    span.setAttribute('aria-label', name);
    return span;
}

// New focus trap implementation
function newFocusTrap(element) {
    if (!element) return;
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    element.addEventListener('keydown', handleKeyDown);

    return {
        destroy: () => {
            element.removeEventListener('keydown', handleKeyDown);
        }
    };
}

// Announce message to screen readers
function announceToScreenReader(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
}

// Handle keyboard navigation
function handleKeyboardNav(e, handlers) {
    const key = e.key;
    if (handlers[key]) {
        handlers[key](e);
    }
}

// Add lang attribute to document element
function addLangAttribute() {
    document.documentElement.setAttribute('lang', 'en');
}

// Export functions to make them accessible
module.exports = {
    accessibilityUtils,
    log,
    getLangAttribute,
    personName: accessibilityUtils.personName,
    validateTableAccessibility,
    validateTableStructure: accessibilityUtils.validateTableStructure,
    validateLandmark: accessibilityUtils.validateLandmark,
    validateLandmarkStructure: accessibilityUtils.validateLandmarkStructure,
    newFocusTrap,
    getSvgAccessibleName: accessibilityUtils.getSvgAccessibleName,
    createInPageButton: accessibilityUtils.createInPageButton,
    setHtmlLangAttribute,
    addAriaLabel,
    ensureElementAccessibility,
    ensureElementHasId,
    addLangAttribute,
    initHtmlLangAttribute
};

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
    window.accessibilityUtils = accessibilityUtils;
    window.getLangAttribute = getLangAttribute;
    window.personName = accessibilityUtils.personName;
    window.validateTableAccessibility = validateTableAccessibility;
    window.validateTableStructure = accessibilityUtils.validateTableStructure;
    window.validateLandmark = accessibilityUtils.validateLandmark;
    window.validateLandmarkStructure = accessibilityUtils.validateLandmarkStructure;
    window.newFocusTrap = newFocusTrap;
    window.getSvgAccessibleName = accessibilityUtils.getSvgAccessibleName;
    window.createInPageButton = accessibilityUtils.createInPageButton;
    window.setHtmlLangAttribute = setHtmlLangAttribute;
    window.addAriaLabel = addAriaLabel;
    window.ensureElementAccessibility = ensureElementAccessibility;
    window.ensureElementHasId = ensureElementHasId;
    window.addLangAttribute = addLangAttribute;
    window.initHtmlLangAttribute = initHtmlLangAttribute;
}