import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const MainLayout = ({ children }) => {
  return (
    <main className="flex-1" role="main" aria-label="Main content">
      {children}
    </main>
  );
};

// Updated layout components with proper landmarks
const DashboardLayout = ({ children }) => {
  return (
    <body>
      <header role="banner" aria-label="Page header">
        {/* Add header content if needed */}
      </header>
      <MainLayout>{children}</MainLayout>
      <footer role="contentinfo" aria-label="Page footer">
        {/* Add footer content if needed */}
      </footer>
    </body>
  );
};

const AppLayout = ({ children }) => {
  return (
    <body className="min-h-screen flex flex-col" lang="en">
      <header role="banner" aria-label="Page header">
        {/* Add header content if needed */}
      </header>
      <MainLayout>{children}</MainLayout>
      <footer role="contentinfo" aria-label="Page footer">
        {/* Add footer content if needed */}
      </footer>
    </body>
  );
};

// Existing initialization code
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all existing exports (preserved as-is)
export { App, DashboardLayout, AppLayout };