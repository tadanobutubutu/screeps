import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setLanguage } from './language-utils';

// Check if TypeScript is enabled, define a type for Layout component if needed
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
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Set the language attribute on the root element
setLanguage('en');
document.documentElement.lang = 'en';