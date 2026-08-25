// Addressed accessibility issues from insight report:
// - REACT_015: lang attribute handled in index.html
// - REACT_027: table structure corrected in Table component
// - REACT_017: landmarks adjusted via roles/aria-labels
// - REACT_041: accessible names added to SVG components
// - REACT_025: unique keys applied to landmarks in Dashboard
// - REACT_036: fake link replaced with valid anchor

import React from 'react';

export function Dashboard() {
  return (
    <div>
      <header role="banner" key="dash-banner">
        Dashboard Header
      </header>
      <main role="main" key="dash-main" aria-label="Dashboard Main Content">
        <section aria-label="Overview">
          <Table />
        </section>
        <div role="region" aria-label="Visualizations" key="dash-visuals">
          <SVGOne />
          <SVGTwo />
        </div>
        <AccessibleAnchor />
      </main>
      <aside role="complementary" key="dash-aside" aria-label="Dashboard Sidebar">
        <nav aria-label="Secondary Navigation">
          <AccessibleAnchor />
        </nav>
      </aside>
      <footer role="contentinfo" key="dash-footer">
        Footer
      </footer>
    </div>
  );
}

export function Table() {
  return (
    <table role="table" aria-label="Data Table">
      <caption>Summary Data</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Item 1</td>
          <td>100</td>
        </tr>
      </tbody>
    </table>
  );
}

export function SVGOne() {
  return (
    <svg aria-label="Chart SVG" role="img" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function SVGTwo() {
  return (
    <svg aria-label="Info SVG" role="img" width="24" height="24" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" />
    </svg>
  );
}

export function AccessibleAnchor() {
  return <a href="/dashboard" aria-label="Dashboard link">Dashboard</a>;
}

export default function Main() {
  return <Dashboard />;
}