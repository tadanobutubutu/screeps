// main.js - Resolved conflict
// This version keeps both changes, integrates them, and adds some adjustments for better cohesion.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setLanguage } from './language-utils'; // Assume this file exports a function setLanguage(lang: string) that sets the lang attribute on the document.documentElement

// Check if TypeScript is enabled, define a Type for Layout component if needed
let Layout: React.FC<any> | undefined;
if (typeof React !== 'undefined') {
  Layout = (props: any) => {
    return (
      <main>
        {props.children}
      </main>
    );
  };
}

// New component for the rotate back button
export function RotateBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button id="unrotate" onClick={onClick}>
      rotate back
    </button>
  );
}

// New component for the dependency graph page
export function DependencyGraphPage({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}
    </main>
  );
}

// New component for the docs index page
export function DocsIndexPage({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Set the initial language before rendering the App
setLanguage('en'); // Replace 'en' with the initial language, e.g., from environment variables or configuration

root.render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>
);

// If using older React (React 17 and below):
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
//
// ReactDOM.render(<App />, document.getElementById('root'));
// setLanguage('en'); // Replace 'en' with the initial language, e.g., from environment variables or configuration