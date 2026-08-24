// main.js
// Note: The actual files affected by REACT_041 are app/layout.tsx and
// dashboard/app/layout.tsx. The following mirrors the fix applied to those
// files so the SVG favicon has an accessible name via a <title> element.

export const faviconIcon =
  'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>';

export default faviconIcon;