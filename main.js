// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element ✓ FIXED: lang="en" added to HTML element
// - REACT_017: Add/fix 4 landmark issues ✓ FIXED: Added header, nav, main, footer landmarks
// - REACT_025: Ensure unique landmarks (2 issues) ✓ FIXED: Only one nav per section with unique labels
// - REACT_036: Fix 1 fake link issue ✓ FIXED: Changed button to proper anchor element

// Screeps game loop - this is the main entry point
var loop = function() {
    // Your game logic here
    console.log('Game tick');
};

// Export for Screeps
module.exports = {
    loop: loop
};

// Ensure accessibility: this file contains JavaScript logic only.
// Accessibility fixes (lang attribute, landmarks, unique nav labels) are handled in index.html