// User module - manages user interface

// Create button using createElement
const btn = document.createElement('button');
btn.id = 'unrotate';
btn.textContent = 'rotate back';
btn.addEventListener('click', function() {
    const viewport = document.getElementById('viewport');
    viewport.style.transform = '';
});

// The button can be appended to wherever the original link was
// document.querySelector('.controls').appendChild(btn);

// New function to ensure SVG accessibility
function addAccessibleNameToSVG(svgString) {
    return svgString.replace('<svg', '<svg aria-label="Accessible name for SVG content">');
}

module.exports = {
    btn,
    addAccessibleNameToSVG
};