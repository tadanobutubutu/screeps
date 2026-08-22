// This appears to be a placeholder - the actual fix needs to be applied to:
// 1. app/layout.tsx
// 2. dashboard/app/layout.tsx
//
// The fix for SVG accessibility in Next.js layout.tsx files would be:
//
// For decorative SVGs (like favicons), add aria-hidden="true":
// <svg aria-hidden="true" viewBox="0 0 100 100" ...>
//
// Or add a title element with proper ID for accessible name:
// <svg><title id="unique-id">Accessible Name</title>...</svg>
//
// Or add aria-label directly:
// <svg aria-label="Descriptive name" viewBox="0 0 100 100" ...>

module.exports = {
  // Jest configuration would go here
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};