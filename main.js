// Assuming that 'import React' and 'ReactDOM' are defined elsewhere in your project
import React from 'react';
import ReactDOM from 'react-dom';

// Import your layout components or components that render the primary content
import DashboardLayout from './dashboard/app/layout';
import DocsDependencyGraph from './docs/dependency-graph';
import DocsIndex from './docs/index';
import AppLayout from './app/layout';

// IMPORTANT: The <html> element must have a lang attribute for accessibility.
// Add lang="en" (or your document's language) to your index.html file:
// <html lang="en">
// This ensures screen readers use the correct language for pronunciation.

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
  document.getElementById('root')
);

// ... rest of your main.js file ...