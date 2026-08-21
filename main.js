// @ts-check
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  formatBytes,
  formatTimestamp,
  formatDuration,
  getCyTableData,
  getMochaTableData,
  getCodeComplexityData,
  getDependencyData,
  getSnykData,
} from './utils.js';
import { Chart } from './charts/index.js';

const MOCHA_TABLE_ID = 'table-rotated';
const CY_TABLE_ID = 'mocha-rotated';
const CODECOMPLEXITY_ID = 'code-complexity-rotated';
const DEPENDENCY_ID = 'dependency-rotated';
const SNYK_ID = 'snyk-rotated';

/**
 * @typedef {Object} TableConfig
 * @property {string} tableId
 * @property {string} headingId
 * @property {string} caption
 * @property {string} rotateAfter
 * @property {Array<{headings: string[], rows: string[][]}>} data
 */

/** @type {TableConfig} */
const mochaConfig = {
  tableId: MOCHA_TABLE_ID,
  headingId: 'mocha-tests',
  caption: 'Mocha Tests',
  rotateAfter: '400px',
  data: getMochaTableData(),
};

/** @type {TableConfig} */
const cyConfig = {
  tableId: CY_TABLE_ID,
  headingId: 'cy-tests',
  caption: 'Cypress Tests',
  rotateAfter: '600px',
  data: getCyTableData(),
};

/** @type {TableConfig} */
const codeComplexityConfig = {
  tableId: CODECOMPLEXITY_ID,
  headingId: 'code-complexity',
  caption: 'Plato Code Complexity Report',
  rotateAfter: '400px',
  data: getCodeComplexityData(),
};

/** @type {TableConfig} */
const dependencyConfig = {
  tableId: DEPENDENCY_ID,
  headingId: 'dependency-graph',
  caption: 'Dependency Graph',
  rotateAfter: '400px',
  data: getDependencyData(),
};

/** @type {TableConfig} */
const snykConfig = {
  tableId: SNYK_ID,
  headingId: 'snyk-report',
  caption: 'Snyk Security Report',
  rotateAfter: '400px',
  data: getSnykData(),
};

function Table(config) {
  const { tableId, headingId, caption, rotateAfter, data } = config;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>{caption}</h2>
      <div className="table-container" style={{ '--rotate-after': rotateAfter }}>
        <table id={tableId}>
          <thead>
            <tr>
              {data[0].headings.map((heading, index) => (
                <th key={index}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function App() {
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    // Check if screen size requires chart display
    const mediaQuery = window.matchMedia('(min-width: 1200px)');
    setShowChart(mediaQuery.matches);

    const handler = (e) => setShowChart(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <main>
      <div className="container">
        <h2>Quality &amp; Metrics Reports</h2>
        <p>
          This repository is fully optimized with automated tools. Explore the generated
          reports below:
        </p>
        <div className="links">
          <a href="https://dashboard.snyk.io" target="_blank" rel="noopener noreferrer">
            🔒 Snyk Security Report
          </a>
          <a href="https://www.npmjs.com" target="_blank" rel="noopener noreferrer">
            📦 NPM Registry
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            🐙 GitHub Repository
          </a>
          <a href="https://codeclimate.com" target="_blank" rel="noopener noreferrer">
            🌡️ Code Climate
          </a>
        </div>
      </div>
      {showChart && <Chart />}
      <Table {...mochaConfig} />
      <Table {...cyConfig} />
      <Table {...codeComplexityConfig} />
      <Table {...dependencyConfig} />
      <Table {...snykConfig} />
    </main>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);