import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/ AuthContext';
import { getDashboardData } from '../lib/api';
import { DashboardData } from '../types/dashboard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DashboardContent from './DashboardContent';

// For app/root.tsx, dashboard/app/layout.tsx, docs/app/index.tsx
const AppLayout = ({ children }) => (
  <body lang="en" className="min-h-screen flex flex-col">
    <main role="main">{children}</main>
  </body>
);

// For dashboard/app/dependency-graph/page.tsx
const DependencyGraph = () => {
  const [rotate, setRotate] = useState(false);

  const handleRotateBack = () => {
    setRotate(false);
    // Add additional logic if needed
  };

  return (
    <main role="main">
      <table id="table-rotated" aria-label="Dependency graph table">
        {/* Table content */}
      </table>
      {rotate ? (
        <button id="unrotate" onClick={handleRotateBack}>rotate back</button>
      ) : (
        <a id="unrotate" href="#">rotate back</a>
      )}
    </main>
  );
};

export default DependencyGraph;