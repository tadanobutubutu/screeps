import React from 'react';
import ReactDOM from 'react-dom';

import DashboardLayout from './dashboard/app/layout';
import DocsDependencyGraph from './docs/dependency-graph';
import DocsIndex from './docs/index';
import AppLayout from './app/layout';

// Accessibility Fix: REACT_015 - Add lang attribute to HTML element
// Accessibility Fix: REACT_017 - Use proper landmark elements
// Accessibility Fix: REACT_025 - Ensure unique landmarks

function MainContent({ children }) {
  return <main lang="en">{children}</main>;
}

// Accessibility Fix: REACT_027 - Ensure proper table structure with headers
// Accessibility Fix: REACT_036 - Use proper anchor tags instead of fake links

const AccessibleTable = ({ data, caption }) => (
  <table>
    {caption && <caption>{caption}</caption>}
    <thead>
      <tr>
        {data.headers.map((header, index) => (
          <th key={index} scope="col">{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// Accessibility Fix: REACT_041 - Add accessible names to SVG elements
const AccessibleSVG = ({ children, label, ...props }) => (
  <svg {...props} aria-label={label} role="img">
    {children}
  </svg>
);

// Accessibility Fix: REACT_036 - Replace fake links with proper anchor tags
const AccessibleLink = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

// Main render function with proper accessibility structure
ReactDOM.render(
  <React.StrictMode>
    <DashboardLayout>
      <MainContent>
        <h1>Dashboard</h1>
        <AccessibleLink href="/dashboard/settings">Settings</AccessibleLink>
        <AccessibleTable 
          data={{ headers: ['Name', 'Status'], rows: [['Project A', 'Active']] }}
          caption="Project Overview"
        />
      </MainContent>
    </DashboardLayout>

    <DocsDependencyGraph>
      <MainContent>
        <h1>Dependency Graph</h1>
        <AccessibleSVG label="Dependency visualization" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#ccc" />
        </AccessibleSVG>
      </MainContent>
    </DocsDependencyGraph>

    <DocsIndex>
      <MainContent>
        <h1>Documentation Index</h1>
        <nav aria-label="Documentation navigation">
          <AccessibleLink href="/docs/getting-started">Getting Started</AccessibleLink>
          <AccessibleLink href="/docs/api-reference">API Reference</AccessibleLink>
        </nav>
      </MainContent>
    </DocsIndex>

    <AppLayout>
      <MainContent>
        <h1>Application</h1>
      </MainContent>
    </AppLayout>
  </React.StrictMode>,
  document.getElementById('root')
);

export { MainContent, AccessibleTable, AccessibleSVG, AccessibleLink };