// Assuming this is the part of your code that uses the problematic link
function rotateBack() {
  // ... (existing code to rotate back)
}

// Replace the anchor tag with a button
// Ensure to maintain the `id` attribute if it's being used elsewhere
document.getElementById('unrotate').innerHTML = `
  <button onclick="rotateBack()">rotate back</button>
`;

// Wrap the primary content in <main> for accessibility
document.querySelector('main').innerHTML = `
  <main>
    ${document.querySelector('main').innerHTML}
  </main>
`;