// Assuming that 'import React' and 'ReactDOM' are defined elsewhere in your project
import React from 'react';
import ReactDOM from 'react-dom';

// Import your layout components or components that render the primary content
import DashboardLayout from './dashboard/app/layout';
import DocsDependencyGraph from ...
import DocsIndex from './docs/index';
import AppLayout from './app/layout';

// Update your render logic to wrap the primary content with <main>
ReactDOM.render(
  <React.StrictMode>
    <DashboardLayout>
      <main>
        {/* Dashboard primary content */}
      </main>
    </DashboardLayout>

    <DocsDependencyGraph>
      <main>
        {/* Docs Dependency Graph primary content */}
      </main>
    </DocsDependencyGraph>

    <DocsIndex>
      <main>
        {/* Docs Index primary content */}
      </main>
    </DocsIndex>

    <AppLayout>
      <main>
        {/* App Layout primary content */}
      </main>
    </AppLayout>
  </React.StrictMode>,
  ...
);

// ... rest of your main.js file ...