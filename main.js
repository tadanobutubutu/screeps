tsx
// app/layout.tsx
import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <body>
      <main>
        {children}
      </main>
    </body>
  );
};

export default Layout;

// dashboard/app/layout.tsx
import React from 'react';

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <body>
      <main>
        {children}
      </main>
    </body>
  );
};

export default DashboardLayout;

// docs/dependency-graph.html
// Assuming this is an HTML file with a TypeScript component:
import React from 'react';
import { render } from 'react-dom';

const DependencyGraphComponent: React.FC = () => {
  return (
    <main>
      <table id="table-rotated">
        {/* table content */}
      </table>
    </main>
  );
};

// This component should be rendered by a script that targets the DOM element with id="app"
// render(<DependencyGraphComponent />, document.getElementById('app'));