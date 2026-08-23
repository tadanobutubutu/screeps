import './index.html';
import './dependency-graph.html';

// Ensure main content is wrapped in <main> landmark
document.body.innerHTML = `
<main>
${document.body.innerHTML}
</main>
`.trim();

// Preserve existing exports and functions
export const someFunction = () => { /* existing code */ };
export const anotherFunction = () => { /* existing code */ };