// Existing code (preserved as-is)
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// New code added for the React Landmarks fix
const MainLayout = ({ children }) => {
  return (
    <main className="flex-1">
      {children}
    </main>
  );
};

// Updated layout components
const DashboardLayout = ({ children }) => {
  return (
    <body>
      <MainLayout>{children}</MainLayout>
    </body>
  );
};

const AppLayout = ({ children }) => {
  return (
    <body className="min-h-screen flex flex-col">
      <MainLayout>{children}</MainLayout>
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