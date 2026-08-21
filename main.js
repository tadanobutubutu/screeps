import type { Metadata } from 'next';
import React from 'react';
import ReactDOM from 'react-dom/client';

export const metadata: Metadata = {
  title: 'App Title',
  description: 'App description',
};

const App = () => {
  return (
    <div id="root" lang="en" role="main">
      <header role="banner">
        <h1>User Data</h1>
      </header>
      <main id="main-content">
        <p id="description">This is a demo application.</p>
        <table id="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th scope="col">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>30</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>25</td>
            </tr>
            <tr>
              <td>Charlie</td>
              <td>40</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize React root once on mount
  if (typeof document !== 'undefined') {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }

  return (
    <html lang="en">
      <body>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* SVG content */}
        </svg>
        <main>
          {/* Preserve any additional page content */}
          {children}
        </main>
      </body>
    </html>
  );
}