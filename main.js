import React from 'react';
import ReactDOM from 'react-dom';

import DashboardLayout from './dashboard/app/layout';
import DocsDependencyGraph from './docs/dependency-graph';
import DocsIndex from './docs/index';
import AppLayout from './app/layout';

ReactDOM.render(
  <React.StrictMode>
    <DashboardLayout>
      <main>
        {/* Dashboard primary content */}
        <div id="my-added-dashboard-content"></div>
      </main>
    </DashboardLayout>

    <DocsDependencyGraph>
      <main>
        {/* Docs Dependency Graph primary content */}
        <div id="my-added-docs-dependency-graph-content"></div>
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
        <div id="my-added-app-layout-content"></div>
      </main>
    </AppLayout>
  </React.StrictMode>,
  document.getElementById('root')
);

// ... rest of your main.js file ...