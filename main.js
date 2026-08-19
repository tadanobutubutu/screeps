// main.js before fix
export function RotateBackLink() {
  return (
    <div>
      {/* Incorrect anchor usage for in-page navigation */}
      <a id="unrotate" href="#">rotate back</a>
    </div>
  );
}

// Add this new function to handle table header scope attributes
function addTableHeaderScopes() {
  // Select all th elements in your table
  const headers = document.querySelectorAll('th');

  headers.forEach((header, index) => {
    // Check if the header already has a scope attribute
    if (!header.hasAttribute('scope')) {
      // Determine if this is a column or row header based on position
      // This is a simple heuristic - you may need to adjust based on your actual table structure
      if (index === 0) {
        header.setAttribute('scope', 'col');
      } else {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Call this function when your table is rendered
document.addEventListener('DOMContentLoaded', addTableHeaderScopes);

// [Your existing code below this point remains unchanged]