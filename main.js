import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Existing code remains unchanged
// ...

// Add accessibility attributes to SVGs in layout files
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    width="0"
    height="0"
    style={{ position: 'absolute' }}
  >
    <title>Favicon</title>
    {/* SVG content */}
  </svg>
);

// Add <main> landmark to fix accessibility warnings
export function MainContent({ children }) {
  return <main>{children}</main>;
}

// Update the root render to include the accessible SVG and main landmark
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FaviconSVG />
    <MainContent>
      <App />
    </MainContent>
  </React.StrictMode>
);

// All existing exports remain unchanged
export { /* existing exports */ };
export default MainContent;