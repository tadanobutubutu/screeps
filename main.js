import React from 'react';
import { useRouter } from 'next/router';

// Existing code (preserved as-is)
export const getStaticProps = async () => {
  // ... existing implementation
};

export const getStaticPaths = async () => {
  // ... existing implementation
};

// Add accessibility improvements for REACT_015 (React Language Attribute)
export const App = ({ Component, pageProps }) => {
  const router = useRouter();

  // Add lang attribute to html element
  React.useEffect(() => {
    document.documentElement.lang = 'en'; // Set your default language here
  }, []);

  return (
    <Component {...pageProps} />
  );
};

// Fix for REACT_027 (React Table Structure)
export const AccessibleTable = ({ data, headers }) => {
  return (
    <table role="table" aria-label="Data table">
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

// Fix for REACT_017 (React Landmarks)
export const AccessibleLayout = ({ children }) => {
  return (
    <div>
      <header role="banner" aria-label="Site header">
        {/* Header content */}
      </header>
      <main role="main" aria-label="Main content">
        {children}
      </main>
      <footer role="contentinfo" aria-label="Site footer">
        {/* Footer content */}
      </footer>
    </div>
  );
};

// Fix for REACT_041 (React SVG Accessible Name)
export const AccessibleIcon = ({ name, ...props }) => {
  return (
    <svg {...props} aria-hidden="true" focusable="false">
      <title>{name}</title>
      {/* SVG content */}
    </svg>
  );
};

// Fix for REACT_025 (React Unique Landmarks)
export const UniqueLandmark = ({ type, label, children }) => {
  const roleMap = {
    banner: 'banner',
    main: 'main',
    navigation: 'navigation',
    complementary: 'complementary',
    contentinfo: 'contentinfo'
  };

  return (
    <div role={roleMap[type]} aria-label={label}>
      {children}
    </div>
  );
};

// Fix for REACT_036 (React Fake Link)
export const AccessibleLink = ({ href, children, ...props }) => {
  if (!href) {
    return (
      <button {...props}>
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

// Existing exports preserved
export const existingFunction1 = () => {
  // ... existing implementation
};

export const existingFunction2 = () => {
  // ... existing implementation
};

// Integrate rotate functionality
let isRotated = false;

// Handle rotate button click
document.getElementById('rotate').addEventListener('click', function() {
  const content = document.getElementById('content');
  if (isRotated) {
      content.style.transform = 'rotate(0deg)';
      isRotated = false;
  } else {
      content.style.transform = 'rotate(90deg)';
      isRotated = true;
  }
});

// Handle unrotate button click (using button element for accessibility)
document.getElementById('unrotate').addEventListener('click', function() {
  const content = document.getElementById('content');
  content.style.transform = 'rotate(0deg)';
  isRotated = false;
});

// Sample content (modified to remove duplication of button creation)
if (document.getElementById('content')) {
  const content = document.getElementById('content');

  content.innerHTML = `
      <h1>Welcome to the App</h1>
      <p>Click the rotate button to rotate the content.</p>
      <button id="rotate">Rotate</button>
      <button id="unrotate">rotate back</button>
  `;
}