// Assuming that 'import React' and 'ReactDOM' are defined elsewhere in your project
import React from 'react';
import ReactDOM from 'react-dom';

// Import your layout components or components that render the primary content
import DashboardLayout from './dashboard/app/layout';
import DocsDependencyGraph from './docs/dependency-graph';
import DocsIndex from './docs/index';
import AppLayout from './app/layout';

// Update your render logic to wrap the primary content with <main>
ReactDOM.render(
  <React.StrictMode>
    <main>
      <DashboardLayout>
        {/* Dashboard primary content */}
      </DashboardLayout>

      <DocsDependencyGraph>
        {/* Docs Dependency Graph primary content */}
      </DocsDependencyGraph>

      <DocsIndex>
        {/* Docs Index primary content */}
      </DocsIndex>

      <AppLayout>
        {/* App Layout primary content */}
      </AppLayout>
    </main>
  </React.StrictMode>,
  document.getElementById('root')
);

// ... rest of your main.js file ...