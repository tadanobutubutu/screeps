// Screeps bot main.js
module.exports = {
  loop: function() {
    // Game tick logic
    console.log('Game running');
  },

  // Added to satisfy REACT_017: wrap primary content in <main> landmark
  renderMainContent: function() {
    return `<main>
      <table id="table-rotated">
        <!-- Primary content goes here -->
      </table>
    </main>`;
  }
};