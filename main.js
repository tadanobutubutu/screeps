// Assuming the following is part of the head section in index.html
const faviconSVG = document.createElement('link');
faviconSVG.rel = 'icon';
faviconSVG.type = 'image/svg+xml';
faviconSVG.href = '/favicon.svg';
faviconSVG.ariaLabel = 'Website Favicon'; // Adding an accessible name for the favicon

document.head.appendChild(faviconSVG);

// Assuming the following is part of the head section in layout.tsx
const faviconSVGLayout = document.createElement('link');
faviconSVGLayout.rel = 'icon';
faviconSVGLayout.type = 'image/svg+xml';
faviconSVGLayout.href = '/favicon.svg';
faviconSVGLayout.ariaLabel = 'Website Favicon'; // Adding an accessible name for the favicon

document.head.appendChild(faviconSVGLayout);