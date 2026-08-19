// main.js
import React from 'react';
import PropTypes from 'prop-types';

// Existing component (preserved as-is)
export function ExistingComponent({ title, description }) {
  return (
    <div className="existing-component">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

ExistingComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// New component with accessibility fixes
export function AccessibleTable({ data, caption }) {
  return (
    <div className="accessible-table-container">
      <table aria-label={caption}>
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
    </div>
  );
}

AccessibleTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  caption: PropTypes.string.isRequired,
};

// New component for landmarks
export function AccessibleLandmark({ type, children }) {
  const landmarkMap = {
    main: 'main',
    navigation: 'nav',
    search: 'section',
    contentinfo: 'footer',
  };

  const Tag = landmarkMap[type] || 'section';

  return (
    <Tag aria-label={type === 'search' ? 'Search' : undefined}>
      {children}
    </Tag>
  );
}

AccessibleLandmark.propTypes = {
  type: PropTypes.oneOf(['main', 'navigation', 'search', 'contentinfo']).isRequired,
  children: PropTypes.node.isRequired,
};

// New component for accessible SVG
export function AccessibleSVG({ title, description, children }) {
  return (
    <svg role="img" aria-label={`${title}: ${description}`}>
      <title>{title}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  );
}

AccessibleSVG.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// New component for fake links
export function AccessibleButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="accessible-button"
    >
      {children}
    </button>
  );
}

AccessibleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// Language attribute fix
export function LanguageWrapper({ lang, children }) {
  return (
    <div lang={lang}>
      {children}
    </div>
  );
}

LanguageWrapper.propTypes = {
  lang: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};