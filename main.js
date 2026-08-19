// main.js
import React from 'react';
import Head from 'next/head';

// Existing exports should remain unchanged
export const existingFunction = () => {
  // ... existing code
};

// New accessibility-focused functions
export const setLanguageAttribute = (lang = 'en') => {
  // REACT_015: React Language Attribute
  return <html lang={lang} />;
};

export const createAccessibleTable = (data, caption) => {
  // REACT_027: React Table Structure
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

export const addLandmark = (role, children, ariaLabel) => {
  // REACT_017: React Landmarks
  // REACT_025: React Unique Landmarks
  return (
    <section role={role} aria-label={ariaLabel}>
      {children}
    </section>
  );
};

export const createAccessibleSVG = (title, description, children) => {
  // REACT_041: React SVG Accessible Name
  return (
    <svg aria-hidden="true">
      <title>{title}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  );
};

export const createAccessibleLink = (href, text, isButton = false) => {
  // REACT_036: React Fake Link
  if (isButton) {
    return <button onClick={() => window.location.href = href}>{text}</button>;
  }
  return <a href={href}>{text}</a>;
};

// Example of how to use these in a component
export const AccessibleComponent = () => {
  const tableData = [
    { Name: 'John', Age: 30 },
    { Name: 'Jane', Age: 25 }
  ];

  return (
    <>
      <Head>
        <title>Accessible Page</title>
      </Head>
      {setLanguageAttribute('en')}
      <main>
        {addLandmark('main', (
          <>
            <h1>Accessible Content</h1>
            {createAccessibleTable(tableData, 'User Information')}
            {createAccessibleSVG('Chart', 'A bar chart showing user data', (
              <rect x="10" y="10" width="30" height="30" fill="blue" />
            ))}
            {createAccessibleLink('/about', 'About Us')}
          </>
        ), 'Main Content')}
      </main>
    </>
  );
};