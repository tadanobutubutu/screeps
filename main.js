// Preserve existing code
// ... (code before the conflict)

// Add the new function or change requested in the issue
const updateNavigationLink = () => {
  const link = document.getElementById('unrotate');
  if (link) {
    link.innerHTML = 'rotate back'; // Update the button text if necessary
    link.onclick = function() {
      // Implement the action that the link was supposed to do
      // For example, if it was supposed to scroll back to the top:
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }
};

// Call the function to update the link
updateNavigationLink();

// ... (code after the conflict)