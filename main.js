// main.js - Fixed Accessibility Issues

import React from 'react';

// Accessibility helper components
export const AccessibilityProvider = ({ children, language = 'en' }) => {
  return (
    <div lang={language}>
      {children}
    </div>
  );
};

export const MainLandmark = ({ children, id }) => {
  return (
    <main id={id} role="main">
      {children}
    </main>
  );
};

export const NavigationLandmark = ({ children, ariaLabel, id }) => {
  return (
    <nav id={id} aria-label={ariaLabel || 'Main navigation'}>
      {children}
    </nav>
  );
};

export const HeaderLandmark = ({ children, id }) => {
  return (
    <header id={id} role="banner">
      {children}
    </header>
  );
};

export const FooterLandmark = ({ children, id }) => {
  return (
    <footer id={id} role="contentinfo">
      {children}
    </footer>
  );
};

export const AccessibleTable = ({ headers, rows, caption }) => {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AccessibleSVG = ({ children, ariaLabel, description, id }) => {
  return (
    <svg aria-labelledby={id ? `${id}-title` : undefined} role="img">
      {id && <title id={`${id}-title`}>{ariaLabel}</title>}
      {description && <desc id={`${id}-desc`}>{description}</desc>}
      {children}
    </svg>
  );
};

export const RealLink = ({ href, children, onClick, external = false }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a href={href} onClick={handleClick} {...linkProps}>
      {children}
    </a>
  );
};

export const SkipLink = ({ targetId, children = 'Skip to main content' }) => {
  return (
    <a href={`#${targetId}`} className="skip-link" style={{
      position: 'absolute',
      left: '-9999px',
      top: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden'
    }}>
      {children}
    </a>
  );
};

// Existing code - PRESERVED
export const main = async () => {
  console.log('Main function executed');
};

export const processData = (data) => {
  return data.map(item => ({
    ...item,
    processed: true
  }));
};

export const validateInput = (input) => {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Invalid input' };
  }
  return { valid: true, value: input.trim() };
};

export const formatOutput = (data, options = {}) => {
  const { uppercase = false, prefix = '' } = options;
  return data.map(item => {
    let formatted = item;
    if (uppercase) formatted = formatted.toUpperCase();
    if (prefix) formatted = `${prefix}${formatted}`;
    return formatted;
  });
};

export default {
  main,
  processData,
  validateInput,
  formatOutput,
  AccessibilityProvider,
  MainLandmark,
  NavigationLandmark,
  HeaderLandmark,
  FooterLandmark,
  AccessibleTable,
  AccessibleSVG,
  RealLink,
  SkipLink
};