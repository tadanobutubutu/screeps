// Rotate back button implementation
function setupUnrotate() {
    const unrotate = document.getElementById('unrotate');
    if (unrotate) {
        unrotate.addEventListener('click', function() {
            // Reset rotation to original state
            document.body.style.transform = 'rotate(0deg)';
        });
    }
}

// Use <button> instead of <a href="#"> for in-page actions
function createUnrotateButton() {
    const unrotate = document.getElementById('unrotate');
    if (unrotate) {
        const button = document.createElement('button');
        button.id = 'unrotate';
        button.textContent = 'rotate back';
        button.addEventListener('click', function() {
            document.body.style.transform = 'rotate(0deg)';
        });

        // Replace the <a> with the new <button>
        unrotate.parentNode.replaceChild(button, unrotate);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupUnrotate();
    createUnrotateButton();
});