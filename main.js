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
  }
};

// Replace the <a> tag with a <button> in the HTML file
// Example:
// <button id="unrotate" onclick="rotateBack()">rotate back</button>