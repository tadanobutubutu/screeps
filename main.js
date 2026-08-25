// Assuming that main.js is dynamically rendering the HTML, here's how you would update the code to include the <main> element for both pages.

// For dependency-graph.html
const contentDependencyGraph = `
<main>
    <table id="table-rotated">
        <!-- ... rest of the table content ... -->
    </table>
</main>
`;

// For index.html
const contentIndex = `
<main>
    <div class="container">
        <h2>Quality & Metrics Reports</h2>
        <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
        <div class="links">
            <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
            <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
        </div>
    </div>
</main>
`;

// The above content would be included in the main.js where the HTML is dynamically rendered.
// Example of how it might look in a React component:
export default function HomePage() {
    return (
        <div>
            {contentIndex}
            {/* ... other components ... */}
        </div>
    );
}

// Make sure to include similar <main> elements for other pages as needed.