var loop = function() {
    // Your logic here
};

/**
 * Creates an unrotate button element for the rotate-back functionality
 * Uses a button element instead of <a href="#"> for proper accessibility
 * @returns {HTMLButtonElement} The button element
 */
var createUnrotateButton = function() {
    var button = document.createElement('button');
    button.id = 'unrotate';
    button.type = 'button';
    button.textContent = 'rotate back';
    return button;
};

/**
 * Handles the unrotate action - should be attached to the button click event
 * Instead of using <a href="#">, this properly manages the interaction
 */
var handleUnrotate = function() {
    // Your unrotate logic here
    console.log('Unrotating...');
};

module.exports = {
    loop: loop,
    createUnrotateButton: createUnrotateButton,
    handleUnrotate: handleUnrotate
};