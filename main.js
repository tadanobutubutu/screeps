// Favicon SVG generators for Screeps Dashboard
const faviconSVG = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    <title>Screeps Dashboard</title>
    <text y=".9em" font-size="90" font-family="sans-serif">⬢</text>
  </svg>
`;

const secondFaviconSVG = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    <text y=".9em" font-size="90" font-family="sans-serif">⬢</text>
  </svg>
`;

// Dependency information for dashboard display
const dependencyInfo = {
  lastUpdated: new Date().toISOString(),
  renovateDashboard: true,
  trackedDependencies: [
    '@supabase/supabase-js',
    'next',
    'react',
    'react-dom',
    '@types/node',
    '@types/react',
    'postcss',
    'typescript'
  ]
};

// Utility function to generate favicon data URLs
function generateFaviconDataURL(svg) {
  const encoded = svg.trim().replace(/"/g, "'").replace(/>\s+</g, '><');
  return `data:image/svg+xml,${encodeURIComponent(encoded)}`;
}

module.exports = {
  favicon: faviconSVG,
  secondFavicon: secondFaviconSVG,
  generateFaviconDataURL,
  dependencyInfo
};