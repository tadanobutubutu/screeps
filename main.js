// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// ... (the existing code provided by you)
// ----- END ORIGINAL CODE (unchanged) -----

const getAccessibleName = (node) => {
  const { svg, title, text } = node;

  let accessibleName = 'unknown';

  if (svg && svg.tagName === 'svg') {
    // Try aria-label first, then fallback to title or text
    const ariaLabel = svg.getAttribute ? svg.getAttribute('aria-label') : null;
    if (ariaLabel) {
      accessibleName = ariaLabel;
    } else {
      accessibleName = title || text;
    }
  }

  return accessibleName;
};

module.exports = {
  loop: function() {
    // Main game loop
    for (var name in Game.rooms) {
      var room = Game.rooms[name];
      console.log('Room "' + name + '" has ' + room.controller.level + ' level controller');
    }
  }
};

// TODO: Address accessibility issues from insight report