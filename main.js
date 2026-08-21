import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Set lang attribute on document
document.documentElement.lang = 'en';

// Assuming `main.js` has a function that sets the favicon, it might look something like this:

// ... other code ...

function setFavicon(iconData) {
  // Set the favicon for the page
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = iconData;
  document.getElementsByTagName('head')[0].appendChild(link);
}

function addAccessibleName(svgString) {
  // Check if the SVG string contains an accessible name or is decorative
  const isDecorative = /<svg.*>([\s\S]*?)<\/svg>/i.test(svgString) && !/<title.*?>|aria-label.*?>/i.test(svgString);
  if (isDecorative) {
    // Add an aria-hidden attribute to make the SVG decorative and hidden to screen readers
    const modifiedSvgString = svgString.replace('<svg', '<svg aria-hidden="true"');
    return modifiedSvgString;
  }
  return svgString;
}

// Example of setting the favicon with an SVG that lacks an accessible name
setFavicon('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>');

// Assuming 'main.js' imports the SVG strings for favicons from other parts of the code
const faviconSvgString = import('path/to/favicon/svg').then((module) => module.default);

// Example usage:
faviconSvgString.then((svgString) => {
  const updatedSvgString = addAccessibleName(svgString);
  // Now, the updated SVG string can be used to set the favicon or anywhere else in the application
  setFavicon('data:image/svg+xml,' + encodeURIComponent(updatedSvgString));
});

// Add a method to change the language of the document dynamically
function changeDocumentLanguage(language) {
  document.documentElement.lang = language;
}

// ... other code ...
```

This example preserves the React-related code from the original repository, merges in the new `addAccessibleName` and `changeDocumentLanguage` functions, and adds a new method to dynamically switch the language of the document. The `setFavicon` function remains intact, and the example of using both functions is demonstrated with an updated favicon import and usage.