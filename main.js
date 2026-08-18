// [Your existing code above this point]

// Add scope attributes to table headers
const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach(header => {
  if (!header.hasAttribute('scope')) {
    header.setAttribute('scope', 'col');
  }
});

// [Your existing code below this point]