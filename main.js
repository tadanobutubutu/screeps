import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import layout from './layout';
import dashboardLayout from './dashboard/layout';

// Wrap the main content in a semantic <main> element for accessibility.
// This component creates a <main> tag if it does not already exist and moves
// the React root into it after the first render.
const MainWrapper = ({ children }) => {
  React.useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && !document.querySelector('main')) {
      const mainElement = document.createElement('main');
      mainElement.appendChild(rootElement);
      // Insert the <main> before any other content to preserve order.
      document.body.insertBefore(mainElement, document.body.firstChild);
    }
  }, []);

  return children;
};

// Render the application wrapped with the semantic <main> element.
ReactDOM.render(
  <React.StrictMode>
    <MainWrapper>
      <App />
      <layout />
      <dashboardLayout />
    </MainWrapper>
  </React.StrictMode>,
  document.getElementById('root')
);

// Icon accessibility improvements – update the SVG strings in layout and
// dashboardLayout components to include aria‑hidden for better screen‑reader
// handling. This change was suggested in the HEAD branch comments.
// Example replacements:
//   icons: { icon: 'data:image/svg+xml,<svg ...>' },
//   => icons: { icon: 'data:image/svg+xml,<svg ...' aria-hidden="true">...</svg>' }
//
// Ensure these updates are applied consistently across the codebase.