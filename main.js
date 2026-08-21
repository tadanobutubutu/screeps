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

// Example of setting the favicon with an SVG that lacks an accessible name
setFavicon('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>');

// ... other code ...