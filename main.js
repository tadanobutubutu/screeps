// Original main.js content before conflict markers
// ... (existing code)

// New changes requested in the issue
// Add the scope attribute to the <th> elements as suggested
const updatedTableHeaders = document.querySelectorAll('th');
updatedTableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

// ... (rest of the original code)

// Existing code after conflict markers
// <<<<<<< HEAD
// ... (existing code)
// ========

// >>>>>>> origin/master
// ... (existing code)

// ... (rest of the original code)