Here is the resolved version of the file 'main.js':

```javascript
tsx
// dashboard/app/layout.tsx

import React, { useEffect, useState } from 'react';

const Layout = ({ children }) => {
  const [svgRotation, setSvgRotation] = useState('0deg');

  useEffect(() => {
    const svg = document.querySelector('svg');
    if (svg) {
      svg.style.transform = svgRotation;
    }
  }, [svgRotation]);

  const handleSvgClick = () => {
    // Rotate svg functionality
    setSvgRotation((currentRotation) => {
      const newRotation = (currentRotation === '0deg') ? '180deg' : '0deg';
      return newRotation;
    });
  };

  return (
    <div>
      {/* ... other components ... */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        role="img"
        aria-label="Icon"
        onClick={handleSvgClick}
      >
        <title>Icon</title>
        {/* SVG content */}
      </svg>
      {/* ... other components ... */}

      {/* Rotate back button - use button for in-page actions */}
      <button
        id="unrotate"
        type="button"
        onClick={() => {
          setSvgRotation('0deg');
        }}
      >
        rotate back
      </button>

      {children}
    </div>
  );
};

export default Layout;
```

This version integrates both changes, adds state management for the SVG rotation using React's `useState` hook, and separates the rotation handling to a `handleSvgClick` function for better modularity, as introduced in the `=== origin/main` changeset. It also keeps the existing rotate-back button behaviour from the `HEAD` changeset.