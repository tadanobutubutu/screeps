// Wrap the HTML content in a script tag to prevent it from being parsed as JavaScript
// This is a workaround for the syntax error, as the actual HTML should be in a separate .html file

// Example of wrapping the HTML content for `docs/dependency-graph.html`
/*
<script type="text/html">
    <main>
        <table id="table-rotated">
            <!-- Other HTML content here -->
        </table>
    </main>
</script>
*/

// Example of wrapping the HTML content for `docs/index.html`
/*
<script type="text/html">
    <main>
        <div class="container">
            <h2>Quality & Metrics Reports</h2>
            <p>
                This repository is fully optimized with automated tools. Explore the generated
                reports below:
            </p>
            <div class="links">
                <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
                <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
            </div>
        </div>
    </main>
</script>
*/

// Other JavaScript code would go here