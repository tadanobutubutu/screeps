// Original main.js content (with conflict markers removed for clarity)
// ... (existing code)

// New changes requested in the issue
// Adding the scope attribute to the <th> elements as suggested
const updatedTableHeaders = document.querySelectorAll('th');
updatedTableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

// ... (rest of the code)