import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set language attribute for accessibility
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </React.StrictMode>
);

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}