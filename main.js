import React from 'react';

// Utility functions (preserved from original)
function generateTableHeaderCell(content) {
  return `<th scope="col">${content}</th>`;
}

function generateTableRow(data) {
  return `<tr>${data.map(item => `<td>${item}</td>`).join('')}</tr>`;
}

// Accessibility functions (new)
export const addLanguageAttribute = (lang = 'en') => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

export const createAccessibleTable = (headers, data) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
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

export const addLandmarks = (children) => {
  return (
    <>
      <header role="banner" aria-label="Site header">
        {/* Header content */}
      </header>
      <main role="main" aria-label="Main content">
        {children}
      </main>
      <footer role="contentinfo" aria-label="Site footer">
        {/* Footer content */}
      </footer>
    </>
  );
};

export const createMainContent = (children, isError = false) => {
  return (
    <main role="main" aria-label={isError ? "Error content" : "Main content"}>
      {children}
    </main>
  );
};

export const createAccessibleSVG = (svgContent, title, desc, isDecorative = false) => {
  if (isDecorative) {
    return (
      <svg aria-hidden="true" focusable="false">
        {svgContent}
      </svg>
    );
  }
  return (
    <svg aria-hidden={!title} focusable="false">
      {title && <title>{title}</title>}
      {desc && <desc>{desc}</desc>}
      {svgContent}
    </svg>
  );
};

export const createDecorativeSVG = (svgContent) => {
  return (
    <svg aria-hidden="true" focusable="false">
      {svgContent}
    </svg>
  );
};

export const createProperLink = (href, text, isExternal = false) => {
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {text}
    </a>
  );
};

export const enhanceTableHeaders = (headers) => {
  return headers.map((header, index) => ({
    ...header,
    scope: 'col',
    key: `header-${index}`
  }));
};

export const createAccessibleButton = (onClick, text, type = 'button', disabled = false) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {text}
    </button>
  );
};

export const createAccessibleForm = (children, formId, formName) => {
  return (
    <form id={formId} name={formName} aria-labelledby={`${formId}-title`}>
      <h2 id={`${formId}-title`}>{formName}</h2>
      {children}
    </form>
  );
};

// Initialize accessibility features when component mounts
export const initAccessibility = () => {
  addLanguageAttribute();
  // Other initialization code...
};

// Example usage (preserving original logic)
// This could be used in a component or script
export const generateTableHTML = (headers, rows) => {
  const tableHTML = `<table>${headers.map(generateTableHeaderCell).join('')}</table>`;
  const tableBodyHTML = `<tbody>${rows.map(generateTableRow).join('')}</tbody>`;
  return { tableHTML, tableBodyHTML };
};

// Initialize when module loads (optional)
initAccessibility();