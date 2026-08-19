// main.js
import { createRoot } from 'react-dom/client';
import App from './App';

// Updated layout components with accessibility attributes
function FaviconSVG() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      {/* SVG content */}
    </svg>
  );
}

function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My App</title>
        <link rel="icon" href="/favicon.ico" />
        {/* Add FaviconSVG with accessibility attributes */}
        <FaviconSVG />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

function DashboardLayout({ children }) {
  return (
    <div>
      {/* Add FaviconSVG with accessibility attributes */}
      <FaviconSVG />
      {children}
    </div>
  );
}

// Existing exports remain unchanged
export { RootLayout, DashboardLayout };

// Render the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);