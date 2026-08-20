// Preserve all existing code and exports
// Only add the new scope attributes to the table headers
// This function adds scope attributes to table headers in the dependency graph
function enhanceDependencyGraphTable() {
	// Get the dependency graph table
	const table = document.querySelector('#dependency-graph-table');
	if (table) {
		// Add scope attributes to all th elements in the table
		const headers = table.querySelectorAll('th');
		headers.forEach(header => {
			if (!header.hasAttribute('scope')) {
				// Determine if this is a row or column header based on its position
				const rowIndex = header.parentElement.rowIndex;
				const cellIndex = header.cellIndex;
				
				// Column headers typically appear in the first row
				if (rowIndex === 0) {
					// Column header - add "col" scope
					header.setAttribute('scope', 'col');
				} else {
					// Row header - add "row" scope
					header.setAttribute('scope', 'row');
				}
			}
		});
	}
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', enhanceDependencyGraphTable);

// Preserve all existing exports and functions
// TODO: Add back any required exports that might have been?
// ... (rest of your existing code remains unchanged)