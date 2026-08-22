// Assuming this is the part of your code that uses the problematic link
function rotateBack() {
  // ... (existing code to rotate back)
}

// Replace the anchor tag with a button
// Ensure to maintain the `id` attribute if it's being used elsewhere
document.getElementById('unrotate').innerHTML = `
  <button onclick="rotateBack()">rotate back</button>
`;

// Update the table headers to include the scope attribute
document.querySelectorAll('th').forEach(th => {
  th.setAttribute('scope', 'col');
});