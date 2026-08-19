// No changes were needed for this file - the accessibility issue (REACT_036)  
// was resolved by changing the HTML markup directly (replacing <a href="#">  
// with <button>) and corresponding CSS/JS updates.

// Entry point for the Screeps bot logic
module.exports.loop = function () {
    // Game initialization and main loop logic
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        creep.run();
    }
};