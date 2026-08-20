// This is a template solution - you'll need to integrate it with your actual main.js content
// The key change is adding scope attributes to all <th> elements in the dependency-graph.html content

// Example of how to modify the table headers:
const updatedDependencyGraph = `
<!DOCTYPE html>
<html>
<head>
    <title>Dependency Graph</title>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th scope="col">Module</th>
                <th scope="col">Dependencies</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">src/constants.js</th>
                <td>None</td>
            </tr>
            <tr>
                <th scope="row">src/managers/roomManager.js</th>
                <td>src/constants.js</td>
            </tr>
            <!-- Additional rows with scope attributes -->
        </tbody>
    </table>
</body>
</html>
`;

// In your actual main.js, you would need to:
// 1. Locate the section that generates the dependency-graph.html content
// 2. Add scope attributes to all <th> elements as shown in the example above
// 3. Ensure the changes don't break any existing functionality or tests

// The exact implementation will depend on how your main.js generates the dependency graph
// You may need to modify template strings, JSX, or other rendering logic