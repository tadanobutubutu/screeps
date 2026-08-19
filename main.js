// main.js
import React from 'react';
import ReactDOM from 'react-dom';

// Existing code (preserved as-is)
export function existingFunction() {
  // ... existing implementation
}

// New accessibility-focused functions
export function setLanguageAttribute(lang = 'en') {
  // REACT_015: React Language Attribute
  document.documentElement.lang = lang;
}

export function createAccessibleTable(caption, headers, data) {
  // REACT_027: React Table Structure
  return (
    <table>
      <caption>{caption}</caption>
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
}

export function addLandmark(role, children) {
  // REACT_017: React Landmarks
  const validRoles = ['main', 'navigation', 'search', 'region', 'complementary', 'contentinfo'];
  if (!validRoles.includes(role)) {
    console.warn(`Invalid landmark role: ${role}. Using 'region' instead.`);
    role = 'region';
  }
  return React.createElement(role, null, children);
}

export function createAccessibleSVG(title, description, children) {
  // REACT_041: React SVG Accessible Name
  return (
    <svg aria-hidden="true">
      <title>{title}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  );
}

export function createUniqueLandmark(role, label, children) {
  // REACT_025: React Unique Landmarks
  const id = `landmark-${role}-${Date.now()}`;
  return React.createElement(role, { 'aria-label': label, id }, children);
}

export function createAccessibleLink(href, text, isButton = false) {
  // REACT_036: React Fake Link
  if (isButton) {
    return <button onClick={() => window.location.href = href}>{text}</button>;
  }
  return <a href={href}>{text}</a>;
}

// Initialize the app
function App() {
  // Set language attribute on mount
  React.useEffect(() => {
    setLanguageAttribute();
  }, []);

  return (
    <div>
      {/* Example usage of accessible components */}
      <main>
        <h1>Accessible Application</h1>
        {createAccessibleTable(
          "User Data",
          ["Name", "Email", "Role"],
          [["John Doe", "john@example.com", "Admin"]]
        )}
      </main>
      <nav aria-label="Main Navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
      {createAccessibleSVG(
        "Chart",
        "A bar chart showing user activity",
        <rect x="10" y="10" width="200" height="100" fill="blue" />
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));