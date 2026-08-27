import React from 'react';

// Existing components
function Header() {
  return <header role="banner">Home</header>;
}

function Main() {
  return (
    <main role="main">
      <section role="region" aria-label="main content">
        <h1>Welcome</h1>
        <svg viewBox="0 0 100 100" aria-label="Icon 1">
          <circle cx="50" cy="50" r="40" />
        </svg>
        <svg viewBox="0 0 100 100" aria-label="Icon 2">
          <circle cx="50" cy="50" r="30" />
        </svg>
      </section>
      <nav role="navigation">
        <a href="/about">About</a>
      </nav>
    </main>
  );
}

// TODO: Implement validateLandmark functionality
function validateLandmark(element) {
  const validLandmarkRoles = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'region',
    'search',
    'form'
  ];

  if (!element) {
    return false;
  }

  const role = element.getAttribute && element.getAttribute('role');
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';

  // Check for explicit landmark role
  if (role && validLandmarkRoles.includes(role)) {
    return true;
  }

  // Check for implicit landmark elements
  const implicitLandmarks = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'section': 'region',
    'form': 'form',
    'search': 'search'
  };

  if (implicitLandmarks[tagName]) {
    return true;
  }

  return false;
}

// New function for REACT_017: Landmark wrapper with unique roles
function LandmarkContainer({ children }) {
  return (
    <section role="region" aria-label="custom region">
      {children}
    </section>
  );
}

// New function for REACT_025: Accessible SVG component
function AccessibleSVG({ viewBox, children, label }) {
  return (
    <svg viewBox={viewBox} aria-label={label}>
      {children}
    </svg>
  );
}

// Updated App component
export default function App() {
  return (
    // Add lang attribute to the root element
    <div lang="en">
      <Header />
      <Main />
      {/* Example usage of new functions */}
      <LandmarkContainer>
        <section role="region" aria-label="additional content">
          {/* Additional UI */}
        </section>
      </LandmarkContainer>
      <AccessibleSVG viewBox="0 0 50 50" label="Button SVG" />
    </div>
  );
}