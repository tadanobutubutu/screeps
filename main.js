// main.js
import React from 'react';

// Existing exports should remain unchanged
export const existingFunction = () => {
  // ... existing implementation
};

// Add new accessibility-focused functions

/**
 * Ensures all React components have proper lang attributes
 * Addresses REACT_015: React Language Attribute
 */
export const ensureLanguageAttributes = (component) => {
  if (!component.props.lang) {
    console.warn('Missing lang attribute in component. Adding default "en".');
    return React.cloneElement(component, { lang: 'en' });
  }
  return component;
};

/**
 * Validates table structure for screen readers
 * Addresses REACT_027: React Table Structure
 */
export const validateTableStructure = (table) => {
  if (!table.props['aria-label'] && !table.props['aria-labelledby']) {
    console.warn('Table missing accessibility label. Add aria-label or aria-labelledby.');
  }

  // Check for proper table structure
  const hasCaption = React.Children.toArray(table.props.children).some(
    child => child.type === 'caption'
  );

  if (!hasCaption) {
    console.warn('Table should include a <caption> element for better accessibility.');
  }

  return table;
};

/**
 * Ensures proper landmark usage
 * Addresses REACT_017: React Landmarks
 */
export const ensureProperLandmarks = (component) => {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const role = component.props.role;

  if (role && landmarkRoles.includes(role)) {
    // Check if landmark is unique
    const existingLandmarks = document.querySelectorAll(`[role="${role}"]`);
    if (existingLandmarks.length > 1) {
      console.warn(`Multiple landmarks with role "${role}". Only one should exist per page.`);
    }
  }

  return component;
};

/**
 * Ensures SVG elements have accessible names
 * Addresses REACT_041: React SVG Accessible Name
 */
export const ensureSvgAccessibility = (svg) => {
  if (!svg.props['aria-label'] && !svg.props['aria-labelledby']) {
    console.warn('SVG element missing accessibility label. Add aria-label or aria-labelledby.');
  }
  return svg;
};

/**
 * Validates fake links (elements styled as links but not actual links)
 * Addresses REACT_036: React Fake Link
 */
export const validateFakeLinks = (element) => {
  const isLinkStyled = element.props.className?.includes('link') ||
                      element.props.style?.cursor === 'pointer';

  if (isLinkStyled && element.type !== 'a') {
    console.warn('Element styled as link but not an actual <a> tag. Consider using proper link semantics.');
  }

  return element;
};

// Example of how to use these functions in your components
export const AccessibleComponent = ({ children }) => {
  // Apply accessibility enhancements
  const enhancedChildren = React.Children.map(children, child => {
    if (child.type === 'table') {
      return validateTableStructure(child);
    }
    if (child.type === 'svg') {
      return ensureSvgAccessibility(child);
    }
    if (child.props.role) {
      return ensureProperLandmarks(child);
    }
    return validateFakeLinks(child);
  });

  return ensureLanguageAttributes(
    <div lang="en">
      {enhancedChildren}
    </div>
  );
};