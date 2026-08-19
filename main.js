import React from 'react';

const Main = () => {
  return (
    <div lang="en">
      <main>
        <div className="container">
          <h2>Quality & Metrics Reports</h2>
          <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
          <div className="links">
            <a href="/code-complexity">Code Complexity Report</a>
            <a href="/dependency-graph" id="dependencyGraphLink">Dependency Graph</a>
            <RotateBackButton id="unrotate" /> {/* Incorporated the new RotateBackButton component */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;

// New component for the rotate back button
function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

function RotateBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      id="unrotate"
      onClick={onClick}
      aria-label="Rotate back to original orientation"
    >
      rotate back
    </button>
  );
}