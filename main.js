module.exports = {
  getGreeting: function() {
    return 'Hello, World!';
  },
  setLangAttribute: function(lang) {
    document.documentElement.lang = lang;
  },
  rotateBack: function() {
    // existing code for rotateBack function
    // Add an event listener for the button click if needed
  },
  // New function to be added or updated
  updateGreeting: function(newGreeting) {
    // Assuming there's an element with id 'greeting' that needs to be updated
    document.getElementById('greeting').innerText = newGreeting;
  }
};

// Replace the <a> tag with a <button> in the HTML file
// Example:
// <button id="unrotate" onclick="rotateBack()">rotate back</button>
// If needed, also add a button for updating the greeting
// <button id="updateGreeting" onclick="updateGreeting('New Greeting')">Update Greeting</button>