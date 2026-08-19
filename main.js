Here is the resolved file content, integrating both changes and removing unnecessary functions:

```javascript
// main.js

// Fixed: Changed <a href="#"> to <button> for accessibility (REACT_036)
function rotate() {
    // existing rotate logic
}

function unrotate() {
    // existing unrotate logic
}

// New function to handle main landmark wrapping
function wrapWithMain(content) {
    return `<main>${content}</main>`;
}

// Fixes for React libraries
export const AccessibleTable = ({ data, headers }) => {
  return (
    <table role="table" aria-label="Data table">
      // ... existing React Table Structure code
    </table>
  );
};

export const AccessibleLayout = ({ children }) => {
  return (
    <div>
      <header role="banner" aria-label="Site header">
        // Header content
      </header>
      <main role="main" aria-label="Main content">
        {wrapWithMain(children)}
      </main>
      <footer role="contentinfo" aria-label="Site footer">
        // Footer content
      </footer>
    </div>
  );
};

export const AccessibleIcon = ({ name, ...props }) => {
  return (
    <svg {...props} aria-hidden="true" focusable="false">
      <title>{name}</title>
      // SVG content
    </svg>
  );
};

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

// ... other existing code ...

// Export all functions
module.exports = {
    rotate,
    unrotate,
    wrapWithMain,
    AccessibleTable,
    AccessibleLayout,
    AccessibleIcon,
    AccessibleLink,
    UniqueLandmark,
    // ... other exports ...
};
```