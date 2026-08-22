// main.js
export default function Main() {
  return (
    <div lang="en">
      {/* Header landmark */}
      <header role="banner">
        <h1>Site Title</h1>
      </header>

      {/* Main landmark - only one per page */}
      <main role="main">
        <nav aria-label="Main navigation">
          <a href="/home">Home</a>
          <a href="/about">About</a>
        </nav>

        {/* Proper table structure */}
        <table>
          <caption>Monthly Sales Report</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Sales</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">January</th>
              <td>$1000</td>
            </tr>
          </tbody>
        </table>

        {/* SVG with accessible name */}
        <svg role="img" aria-label="Chart showing monthly sales" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <title>Sales Chart</title>
          <rect x="10" y="10" width="80" height="80" fill="blue" />
        </svg>

        {/* Proper button instead of fake link */}
        <button type="button" onClick={() => navigate('/contact')}>
          Contact Us
        </button>
      </main>

      {/* Footer landmark */}
      <footer role="contentinfo">
        <p>© 2024 Company</p>
      </footer>
    </div>
  );
}