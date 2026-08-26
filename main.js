// Assuming main.js is a JavaScript file that might be using require or import statements to include HTML files
// Here is an example of how you might update it to include the scope attribute

// Example of a require statement to include an HTML file
const dependencyGraphHtml = require('./docs/dependency-graph.html');

// Example of an import statement to include an HTML file (ES6 syntax)
// import dependencyGraphHtml from './docs/dependency-graph.html';

// You would then need to modify the HTML content to include the scope attribute
// Here's an example of how you might do this in JavaScript if you are manipulating the HTML content dynamically:

// Using the require statement example
dependencyGraphHtml = dependencyGraphHtml.replace(/<th>/g, '<th scope="col">');

// Using the import statement example
dependencyGraphHtml = dependencyGraphHtml.replace(/<th>/g, '<th scope="col">');

// After making the change, you would then save the modified HTML content back to the file
// or if you are using it in a component, you would update the component to use the modified HTML.

// Example of saving the modified HTML content to the file
fs.writeFileSync('./docs/dependency-graph.html', dependencyGraphHtml);

// Example of updating a component to use the modified HTML content
// If you are using a component to render the HTML, you would update the component like this:
// const DependencyGraph = () => {
//   return (
//     <div dangerouslySetInnerHTML={{ __html: dependencyGraphHtml }} />
//   );
// };

// Export the component if needed
// export default DependencyGraph;