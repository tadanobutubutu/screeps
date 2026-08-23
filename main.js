// Screeps bot main.js
module.exports = {
  loop: function() {
    // Game tick logic
    console.log('Game running');

    // Check for multiple <main> elements and fix if necessary
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length > 1) {
      // Remove all but the first <main> element
      for (let i = 1; i < mainElements.length; i++) {
        mainElements[i].parentNode.removeChild(mainElements[i]);
      }
    }
  }
};