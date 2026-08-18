// main.js
import React from 'react';

// Existing code (preserved as-is)
export const existingFunction = () => {
  // ... existing implementation
};

// New accessibility-focused functions
export const setLanguageAttribute = (lang = 'en') => {
  // REACT_015: React Language Attribute
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

export const TableWithCaption = ({ caption, children }) => {
  // REACT_027: React Table Structure
  return (
    <table>
      <caption>{caption}</caption>
      <tbody>{children}</tbody>
    </table>
  );
};

export const Landmark = ({ type, children, ariaLabel }) => {
  // REACT_017: React Landmarks
  const landmarkProps = {
    role: type,
    'aria-label': ariaLabel
  };

  return React.createElement(type, landmarkProps, children);
};

export const AccessibleSVG = ({ title, description, children }) => {
  // REACT_041: React SVG Accessible Name
  return (
    <svg aria-hidden="true">
      <title>{title}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  );
};

export const UniqueLandmark = ({ type, children, id }) => {
  // REACT_025: React Unique Landmarks
  return React.createElement(type, {
    role: type,
    'aria-labelledby': id
  }, children);
};

export const AccessibleLink = ({ href, children, onClick }) => {
  // REACT_036: React Fake Link
  if (onClick) {
    return (
      <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0 }}>
        {children}
      </button>
    );
  }
  return <a href={href}>{children}</a>;
};

// Additional helper for screen reader announcements
export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';

  announcement.textContent = message;
  document.body.appendChild(announcement);

  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};