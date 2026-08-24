// Original code that might have looked like this:
/*
<rootElement> ... </rootElement>
*/

// Updated code with the lang attribute added to the HTML root element
document.documentElement.lang = 'en'; // Replace 'en' with the appropriate language code

// Helper function to handle the rotate back action
function handleUnrotate() {
  // Logic to "rotate back" - removing rotation or resetting view
  document.body.style.transform = 'rotate(0deg)';
}

// Initialize the unrotate button handler (replacing the fake link with a button)
document.addEventListener('DOMContentLoaded', function() {
  const unrotateButton = document.getElementById('unrotate');
  if (unrotateButton) {
    unrotateButton.addEventListener('click', handleUnrotate);
  }
});