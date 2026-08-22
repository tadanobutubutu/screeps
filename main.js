import React from 'react';

// Fix REACT_015: Add proper lang attribute to HTML element
export function createHtmlElement(language = 'en') {
  return {
    type: 'html',
    props: {
      lang: language, // Critical: HTML lang attribute required
      children: []
    }
  };
}

// Fix REACT_027: Proper table structure with th scope
export function createTable(headers, rows) {
  return {
    type: 'table',
    props: {
      children: [
        {
          type: 'thead',
          props: {
            children: [{
              type: 'tr',
              props: {
                children: headers.map(header => ({
                  type: 'th',
                  props: {
                    scope: 'col',
                    children: [header]
                  }
                }))
              }
            }]
          }
        },
        {
          type: 'tbody',
          props: {
            children: rows.map(row => ({
              type: 'tr',
              props: {
                children: row.map(cell => ({
                  type: 'td',
                  props: {
                    children: [cell]
                  }
                }))
              }
            }))
          }
        }
      ]
    }
  };
}

// Fix REACT_041: SVG must have accessible name via aria-label, title, or role="img" with aria-labelledby
export function createSvgIcon(iconName, children = []) {
  return {
    type: 'svg',
    props: {
      'aria-label': iconName, // Provides accessible name for screen readers
      role: 'img',
      children: children
    }
  };
}

// Fix REACT_025 & REACT_017: Use semantic landmark elements with unique labels
export function createPageLayout(children) {
  return {
    type: 'div',
    props: {
      children: [
        {
          type: 'header',
          props: {
            role: 'banner',
            children: children.header || []
          }
        },
        {
          type: 'nav',
          props: {
            'aria-label': 'Main navigation',
            children: children.nav || []
          }
        },
        {
          type: 'main',
          props: {
            role: 'main',
            'aria-label': 'Main content',
            children: children.main || []
          }
        },
        {
          type: 'footer',
          props: {
            role: 'contentinfo',
            children: children.footer || []
          }
        }
      ]
    }
  };
}

// Fix REACT_036: Use real <a> elements instead of fake links
export function createNavigationLink(href, children) {
  return {
    type: 'a',
    props: {
      href: href, // Real href attribute makes it a proper link
      children: children
    }
  };
}

// Ensure unique landmarks across the application
export function ensureUniqueLandmarks(container = document) {
  const landmarks = (container || document).querySelectorAll('nav, main, aside, footer, [role="main"], [role="contentinfo"], header');
  const seenIds = new Set();
  landmarks.forEach(landmark => {
    let id = landmark.id;
    if (!id) {
      id = 'landmark-' + Math.random().toString(36).substring(2, 9);
      landmark.id = id;
    }
    if (seenIds.has(id)) {
      id = 'landmark-' + Math.random().toString(36).substring(2, 9);
      landmark.id = id;
    }
    seenIds.add(id);
  });
}

// Enhance focus visibility for keyboard navigation
export function enhanceFocusVisibility() {
  const style = document.createElement('style');
  style.textContent = `
    *:focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
    svg *:focus {
      outline: none;
    }
    *:focus-visible {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

// Address accessibility issues from insight report
export function addressAccessibilityIssues(container = document) {
  // Add lang attribute to HTML element
  container.documentElement.lang = 'en';

  // Enhance focus visibility for keyboard navigation
  enhanceFocusVisibility();

  // Ensure unique landmarks
  ensureUniqueLandmarks(container);
}

// Set language attribute on the root element
export function setLanguageAttribute(lang) {
  document.documentElement.lang = lang;
}

// Utility to calculate average of a number array
export function calculateAverage(numbers) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

// Export all components and utilities
export { 
  FakeLinkAsButton,
  DependencyGraphTable,
  AccessibleIconSVG,
  GraphIcon,
  SettingsIcon,
  AppWrapper,
  HtmlLangProvider,
  PageLayout,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  createAccessibleFaviconSvg,
  faviconGenerators,
  StatusPage,
  ContentPanel,
  generateId,
  setHtmlLang,
  setLanguageAttribute,
  calculateAverage,
  addressAccessibilityIssues,
  enhanceFocusVisibility
};

export default {
  createHtmlElement,
  createTable,
  createSvgIcon,
  createPageLayout,
  createNavigationLink
};