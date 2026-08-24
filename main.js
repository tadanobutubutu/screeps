const main = () => {
  if (DPS_LANGUAGE === 'en') {
    return `
        <main>
        <table id="table-rotated">
          <thead>
            <tr>
              <th>Source</th>
              <th>Destination</th>
              <th>Type</th>
              <th>Path</th>
              <th>Distance</th>
              <th>Energy remaining</th>
            </tr>
          </thead>
          <tbody>
            ${generateBodyRows()}
          </tbody>
        </table>
        </main>
      `;
  }
  return `
      <main>
      <div class="container">
        <h2>Quality & Metrics Reports</h2>
        <p>
          This repository is fully optimized with automated tools. Explore the generated
          reports below:
        </p>
        <div class="links">
          <a href="https://dova.screepspl.us/codeComplexityReport/index.html" target="_blank">
            Plato Code Complexity Report</a>
          <a href="https://dova.screepspl.us/dependencyGraph/index.html" target="_blank">
            Dependency Graph</a>
        </div>
      </div>
      </main>
    `;
};