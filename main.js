// main.js
// This file contains the main application layout components with proper accessibility landmarks

// Layout component for the main application
export function MainLayout({ children }) {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
}

// Dashboard layout component
export function DashboardLayout({ children }) {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
}

// Documentation layout component
export function DocLayout({ children }) {
  return (
    <main>
      <div className="container">
        {children}
      </div>
    </main>
  );
}

// Dependency graph layout component
export function DependencyGraphLayout({ children }) {
  return (
    <main>
      <table id="table-rotated">
        {children}
      </table>
    </main>
  );
}