import React from 'react';
import ReactDOM from 'react-dom/client';

function rotateBackLinkHandler() {
	// This function would be called when the dependency graph is loaded
	const rotateBackLink = document.getElementById('unrotate');
	if (rotateBackLink) {
		// Create a new button element
		const button = document.createElement('button');
		button.id = 'unrotate';
		button.textContent = 'rotate back';
		button.className = 'rotate-btn';
		button.addEventListener('click', () => {
			document.body.style.transform = 'rotate(0deg)';
		});
	}
}

/**
 * Example accessible table with proper structure
 */
const sampleTable = (
	<table role="table">
		<thead>
			<tr>
				<th scope="col">Column 1</th>
				<th scope="col">Column 2</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Data 1</td>
				<td>Data 2</td>
			</tr>
		</tbody>
	</table>
);

const accessibleSVG = (
	<svg aria-label="Simple diagram illustrating three steps" role="img">
		<circle cx="15" cy="15" r="5" />
		<line x1="15" y1="25" x2="45" y2="25" />
	</svg>
);

function App() {
	return (
		<html lang="en">
			<body>
				<header role="banner">Main Header</header>
				<main role="main">
					<p>This is the primary content area.</p>
					{sampleTable}
					{accessibleSVG}
				</main>
			</body>
		</html>
	);
}

/**
 * The new function to be added as requested in the issue
 */
function someFunction() {
	// Add the functionality of the new function here.
	// Placeholder for new function logic
}

rotateBackLinkHandler();

export { sampleTable, accessibleSVG, someFunction, App };

// Preserve all existing exports and functions below
// ...

// Preserve export default App as per origin branch
export default App;