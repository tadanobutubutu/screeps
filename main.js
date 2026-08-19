import Link from 'next/link';

export default function QualityMetricsReports() {
  return (
    <div lang="en">
      <main>
        <div className="container">
          <h2>Quality &amp; Metrics Reports</h2>
          <p>
            This repository is fully optimized with automated tools. Explore the generated reports below:
          </p>
          <div className="links">
            <Link href="/code-complexity-report">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
                <title>Code Complexity Report</title>
              </svg>
              Code Complexity Report
            </Link>
            <Link href="/dependency-graph">Dependency Graph</Link>
          </div>
        </div>
      </main>
    </div>
  );
}