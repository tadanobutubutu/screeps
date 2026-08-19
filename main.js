// Main.js

import React from 'react';

function existingFunction() {
  // ... some code ...
}

export { existingFunction };

function rotateBack() {
  // Logic to rotate back
}

export { rotateBack };

export const AccessibleComponent = ({ children, lang = 'en' }) => {
  // REACT_015: Add language attribute
  return (
    <div lang={lang}>
      {children}
    </div>
  );
};

export const AccessibleTable = ({ data, caption }) => {
  // REACT_027: Proper table structure with caption
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key} scope="col">{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, i) => (
              <td key={i}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AccessibleLandmark = ({ type, children }) => {
  // REACT_017: Proper landmarks
  const landmarkProps = {
    header: { role: 'banner' },
    navigation: { role: 'navigation' },
    main: { role: 'main' },
    footer: { role: 'contentinfo' },
    aside: { role: 'complementary' }
  };

  return React.createElement(type, landmarkProps[type], children);
};

export const AccessibleSVG = ({ title, description, ...props }) => {
  // REACT_041: SVG with accessible name
  return (
    <svg {...props} aria-hidden={!title}>
      {title && <title>{title}</title>}
      {description && <desc>{description}</desc>}
    </svg>
  );
};

export const UniqueLandmark = ({ type, children }) => {
  // REACT_025: Unique landmarks
  const landmarkCounts = {
    header: 0,
    navigation: 0,
    main: 0,
    footer: 0,
    aside: 0
  };

  if (landmarkCounts[type] > 0) {
    console.warn(`Only one ${type} landmark should exist per page`);
  }
  landmarkCounts[type]++;

  return <AccessibleLandmark type={type}>{children}</AccessibleLandmark>;
};

export const AccessibleLink = ({ href, children, ...props }) => {
  // REACT_036: Fix fake links
  if (!href || href === '#') {
    return (
      <button {...props} onClick={props.onClick}>
        {children}
      </button>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};