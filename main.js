// main.js
import React from 'react';
import Head from 'next/head';

// Existing exports should remain unchanged
export const existingFunction = () => {
  // Your existing code
};

// New accessibility-focused functions
export const setLanguageAttribute = (lang = 'en') => {
  // REACT_015: React Language Attribute
  // Ensure the html element has a lang attribute
  if (typeof window !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

export const createAccessibleTable = (data, caption = '') => {
  // REACT_027: React Table Structure
  // Create properly structured tables with headers
  return (
    <table>
      {caption && <caption>{caption}</caption>}
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

export const addLandmarks = () => {
  // REACT_017: React Landmarks
  // Add proper ARIA landmarks
  return (
    <>
      <header role="banner" aria-label="Site header">
        {/* Header content */}
      </header>
      <main role="main" aria-label="Main content">
        {/* Main content */}
      </main>
      <footer role="contentinfo" aria-label="Site footer">
        {/* Footer content */}
      </footer>
    </>
  );
};

export const createAccessibleSVG = (title, description, children) => {
  // REACT_041: React SVG Accessible Name
  // Create accessible SVGs
  return (
    <svg aria-hidden="true" focusable="false">
      <title>{title}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  );
};

export const createUniqueLandmarks = () => {
  // REACT_025: React Unique Landmarks
  // Ensure landmarks have unique roles
  return (
    <>
      <nav aria-label="Primary navigation">
        {/* Navigation content */}
      </nav>
      <nav aria-label="Secondary navigation">
        {/* Secondary navigation content */}
      </nav>
    </>
  );
};

export const createAccessibleLink = (href, text, isButton = false) => {
  // REACT_036: React Fake Link
  // Create proper links or buttons
  if (isButton) {
    return <button onClick={() => window.location.href = href}>{text}</button>;
  }
  return <a href={href}>{text}</a>;
};

// Add this to your app's root component
export const AccessibilitySetup = () => {
  React.useEffect(() => {
    setLanguageAttribute();
  }, []);

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};