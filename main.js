// role.healer.js
// This is a template - you should replace with your actual code
// The key fix is ensuring proper syntax around line 18

const Healer = {
  // Your existing code here

  // Example of a properly formatted function that might be on line 18
  shouldHeal: function(creep) {
    // Proper comparison syntax
    if (creep.hits < creep.hitsMax * 0.7) {
      return true;
    }
    return false;
  },

  // Rest of your code
};

module.exports = Healer;