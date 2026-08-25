const CONFIG = { debug: true };
const helper = require('./helper');

import { compute } from './math';
import { transform } from './utils';

export function newFunction1() {
  // Example implementation for new functionality
  return compute(42);
}
export function newFunction2() {
  // Example implementation for additional functionality
  return transform('test');
}

function existingFunction() {
  return CONFIG.debug;
}

function wrapInMainLandmark(content) {
    return `<main lang="en" data-testid="main-landmark">\n${content}\n</main>`;
}

function wrapContentInMain() {
    const content = `
    <div class="container">
        <h2>Quality & Metrics Reports</h2>
        <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
        <div class="links">
            <a href="plato-report/index.html">Plato Code Complexity Report</a>
            <a href="dependency-graph.html">Dependency Graph</a>
        </div>
    </div>
    `;
    return wrapInMainLandmark(content);
}

function wrapTableInMain() {
    const tableContent = `
    <table id="table-rotated">
        <thead><tr><th>Module</th><th>Dependencies</th></tr></thead>
        <tbody><tr><td>main.js</td><td>helper, math, utils</td></tr></tbody>
    </table>
    `;
    return wrapInMainLandmark(tableContent);
}

module.exports = {
    existingFunction,
    newFunction1,
    newFunction2,
    wrapInMainLandmark,
    wrapContentInMain,
    wrapTableInMain
};