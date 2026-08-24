// Assuming that `main.js` contains imports and other code that is not directly related to the SVG issue,
// and that the conflict markers are part of a larger codebase that has been modified by another commit.
// Here is a hypothetical snippet of `main.js` that addresses the issue without causing syntax errors:

// File: main.js
import React from 'react';
import { Layout } from 'antd';
import { AppIcon, AppleIcon } from './icons'; // Hypothetical icon component imports

const AppLayout: React.FC = () => {
  return (
    <Layout>
      {/* Other layout components */}
      <Layout.Header>
        <AppIcon aria-label="Screeps Dashboard" />
        <AppleIcon aria-label="Screeps Dashboard for Apple devices" />
      </Layout.Header>
      {/* Other layout components */}
    </Layout>
  );
};

export default AppLayout;

// File: icons.tsx
const AppIcon: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Screeps Dashboard</title>
      <text y="0.9em" fontSize="90">🐛</text>
    </svg>
  );
};

const AppleIcon: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Screeps Dashboard for Apple devices</title>
      <text y="0.9em" fontSize="90">🐛</text>
    </svg>
  );
};

export { AppIcon, AppleIcon };

// Note: The above code assumes that `AppIcon` and `AppleIcon` are defined in a separate file `icons.tsx`.
// It also assumes that the `Layout` component is imported from the `antd` library.
// The `aria-label` attribute is added to each SVG component to provide an accessible name.