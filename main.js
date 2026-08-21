// Assuming the table structure is as follows:
// <table>
//   <thead>
//     <tr>
//       {/* existing th elements */}
//     </tr>
//   </thead>
//   <tbody>
//     {/* existing tbody elements */}
//   </tbody>
// </table>

// Create a function to update the scope attribute of the th elements
function updateTableHeadersScope() {
  // Get the table
  const table = document.querySelector('table');

  if (table) {
    // Get the thead and tr elements
    const thead = table.querySelector('thead');
    const rows = thead.querySelectorAll('tr');

    // Loop through each row and each th element in that row
    rows.forEach((row) => {
      row.querySelectorAll('th').forEach((th) => {
        // Add the scope attribute with a value of 'col'
        th.setAttribute('scope', 'col');
      });
    });
  }
}

// Call the function to update the table headers' scope
updateTableHeadersScope();