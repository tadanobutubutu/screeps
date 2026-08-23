export const API_URL = '/api/insight';
export const SCAN_ID = '997e679e-409c-4ccb-88cf-8b80f159475d';

export function getScoreBreakdown() {
  return {
    screenReader: 79,
    motor: 93,
    visual: 100,
    cognitive: 100,
    general: 100,
  };
}

export function formatGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  return 'C';
}

export default function MainPage() {
  return (
    <div lang="en">
      <header role="banner">
        <nav aria-label="Primary navigation" role="navigation">
          <a href="/">Home</a>
        </nav>
      </header>

      <main id="main-content" role="main">
        <h1>Accessibility Overview</h1>

        <section aria-label="Score summary">
          <h2>Score <span aria-label="87 out of 100">87/100</span> · Grade B</h2>
          <p>41 of 47 checks passed.</p>
        </section>

        <table>
          <caption>Score by category</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Score</th>
              <th scope="col">Findings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Screen Reader</th>
              <td>79/100</td>
              <td>33</td>
            </tr>
            <tr>
              <th scope="row">Motor</th>
              <td>93/100</td>
              <td>1</td>
            </tr>
            <tr>
              <th scope="row">Visual</th>
              <td>100/100</td>
              <td>0</td>
            </tr>
            <tr>
              <th scope="row">Cognitive</th>
              <td>100/100</td>
              <td>0</td>
            </tr>
            <tr>
              <th scope="row">General</th>
              <td>100/100</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>

        <table>
          <caption>Project metrics</caption>
          <thead>
            <tr>
              <th scope="col">Metric</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Project</th>
              <td>2 projects</td>
            </tr>
            <tr>
              <th scope="row">Platform</th>
              <td>nextjs</td>
            </tr>
            <tr>
              <th scope="row">Files scanned</th>
              <td>8</td>
            </tr>
            <tr>
              <th scope="row">Elements analysed</th>
              <td>445</td>
            </tr>
            <tr>
              <th scope="row">Total findings</th>
              <td>34</td>
            </tr>
          </tbody>
        </table>

        <table>
          <caption>Open checks</caption>
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Severity</th>
              <th scope="col">Occurrences</th>
              <th scope="col">Issue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">REACT_015 React Language Attribute</th>
              <td>critical</td>
              <td>1</td>
              <td><a href="/issues/15676">#15676</a></td>
            </tr>
            <tr>
              <th scope="row">REACT_027 React Table Structure</th>
              <td>warning</td>
              <td>26</td>
              <td><a href="/issues/15613">#15613</a></td>
            </tr>
            <tr>
              <th scope="row">REACT_041 React SVG Accessible Name</th>
              <td>warning</td>
              <td>2</td>
              <td><a href="/issues/15674">#15674</a></td>
            </tr>
            <tr>
              <th scope="row">REACT_025 React Unique Landmarks</th>
              <td>warning</td>
              <td>2</td>
              <td><a href="/issues/15675">#15675</a></td>
            </tr>
            <tr>
              <th scope="row">REACT_017 React Landmarks</th>
              <td>warning</td>
              <td>2</td>
              <td><a href="/issues/15610">#15610</a></td>
            </tr>
            <tr>
              <th scope="row">REACT_036 React Fake Link</th>
              <td>warning</td>
              <td>1</td>
              <td><a href="/issues/15614">#15614</a></td>
            </tr>
          </tbody>
        </table>

        <svg aria-label="Score bar chart" role="img" width="200" height="20">
          <title>Score bar chart</title>
        </svg>

        <svg aria-label="Grade indicator" role="img" width="20" height="20">
          <title>Grade indicator</title>
        </svg>

        <p>
          <a href="/details/15614">View fake link fix details</a>
        </p>
      </main>

      <footer role="contentinfo">
        <p>Insight Code · Updated on every push · Scan {SCAN_ID}</p>
      </footer>
    </div>
  );
}