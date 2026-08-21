// Icon configuration for Screeps Dashboard
// This file exports icon definitions used in layout.tsx files

export const icons = {
  icon: {
    href: '/favicon.svg',
    type: 'image/svg+xml',
  },
  apple: {
    href: '/apple-touch-icon.png',
    sizes: '180x180',
    type: 'image/png',
  },
};

// SVG content for favicon (to be saved as public/favicon.svg)
export const faviconSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard">
  <title>Screeps Dashboard</title>
  <text y=".9em" font-size="80">🎮</text>
</svg>`;