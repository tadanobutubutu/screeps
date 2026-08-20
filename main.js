// Original main.js content
// ...

// Changes requested in the issue

// For dashboard/app/layout.tsx and app/layout.tsx
export default function Layout({ children }) {
  return (
    <html lang="ja">
      <head>
        {/* ... existing head content ... */}
      </head>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

// For docs/dependency-graph.html and docs/index.html
export default function DependencyGraph() {
  return (
    <main>
      <table id="table-rotated">
        {/* ... table content ... */}
      </table>
    </main>
  );
}

// Preserve existing code, exports, and functions
// ...

// Complete updated main.js content
// ...