// Function to rotate an element
function rotateElement(elementId, degrees) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.transform = `rotate(${degrees}deg)`;
    }
}

// Reset rotation - changed from <a href="#"> to <button>
function resetRotation() {
    const element = document.getElementById('myImage');
    if (element) {
        element.style.transform = 'rotate(0deg)';
    }
}

// Event listener for the rotate back button
document.addEventListener('DOMContentLoaded', function() {
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
        unrotateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetRotation();
        });
    }
});