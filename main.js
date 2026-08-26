// ... (existing code)

// Function to replace <a> elements with href="#" with <button> elements
function replaceFakeLinks() {
  // Select all <a> elements with an href attribute equal to "#"
  const fakeLinks = document.querySelectorAll('a[href="#"]');

  // Iterate over each fake link and replace it with a <button>
  fakeLinks.forEach(link => {
    // Create a new <button> element
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.id = link.id; // Preserve the ID if it exists

    // Replace the <a> with the <button>
    link.parentNode.replaceChild(button, link);
  });
}

// Call the function to replace fake links when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', replaceFakeLinks);

// ... (existing code)