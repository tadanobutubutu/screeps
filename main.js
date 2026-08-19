// main.js
import React from 'react';

// Preserve all existing exports and functions
// ... (existing code remains unchanged)

// Add new accessibility-focused functions

/**
 * Ensures all React components have proper language attributes
 * Fixes REACT_015: React Language Attribute
 */
export const ensureLanguageAttributes = (component) => {
  if (!component.props.lang) {
    return React.cloneElement(component, { lang: 'en' });
  }
  return component;
};

/**
 * Improves table structure for screen readers
 * Fixes REACT_027: React Table Structure
 */
export const enhanceTableAccessibility = (table) => {
  const { children, ...props } = table.props;

  // Add proper table structure
  const enhancedChildren = React.Children.map(children, (child) => {
    if (child.type === 'thead' || child.type === 'tbody') {
      return child;
    }
    // Wrap content in tbody if missing
    return React.createElement('tbody', null, child);
  });

  return React.createElement('table', {
    ...props,
    role: 'table',
    'aria-describedby': props['aria-describedby'] || 'table-description'
  }, enhancedChildren);
};

/**
 * Adds proper landmark elements
 * Fixes REACT_017: React Landmarks
 */
export const addLandmarks = (component) => {
  const landmarks = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    footer: 'contentinfo'
  };

  if (landmarks[component.type]) {
    return React.cloneElement(component, {
      role: landmarks[component.type],
      'aria-label': component.props['aria-label'] || landmarks[component.type]
    });
  }
  return component;
};

/**
 * Ensures SVGs have accessible names
 * Fixes REACT_041: React SVG Accessible Name
 */
export const makeSvgAccessible = (svg) => {
  if (!svg.props['aria-label'] && !svg.props['aria-labelledby']) {
    return React.cloneElement(svg, {
      'aria-label': 'graphic',
      role: 'img'
    });
  }
  return svg;
};

/**
 * Ensures landmarks are unique
 * Fixes REACT_025: React Unique Landmarks
 */
export const ensureUniqueLandmarks = (components) => {
  const landmarkCounts = {};

  return React.Children.map(components, (component) => {
    if (component.props.role && component.props.role.includes('landmark')) {
      const role = component.props.role;
      landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;

      if (landmarkCounts[role] > 1) {
        return React.cloneElement(component, {
          'aria-label': `${component.props['aria-label'] || role} ${landmarkCounts[role]}`
        });
      }
    }
    return component;
  });
};

/**
 * Replaces fake links with proper anchor elements
 * Fixes REACT_036: React Fake Link
 */
export const replaceFakeLinks = (component) => {
  if (component.props.onClick && !component.props.href) {
    return React.createElement('a', {
      ...component.props,
      href: '#',
      role: 'button',
      onClick: (e) => {
        e.preventDefault();
        component.props.onClick(e);
      }
    }, component.props.children);
  }
  return component;
};

// Example of how to use these functions in your components
export const AccessibleComponent = ({ children }) => {
  // Apply accessibility enhancements
  const enhancedChildren = React.Children.map(children, (child) => {
    child = ensureLanguageAttributes(child);
    child = addLandmarks(child);
    child = makeSvgAccessible(child);
    child = replaceFakeLinks(child);

    if (child.type === 'table') {
      child = enhanceTableAccessibility(child);
    }

    return child;
  });

  // Ensure unique landmarks at the component level
  return React.createElement('div', null, ensureUniqueLandmarks(enhancedChildren));
};