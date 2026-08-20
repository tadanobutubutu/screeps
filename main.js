var rotateAngle = 0;

function loop() {
    // Rotate camera
    rotateAngle += 0.5;
    var camera = Game.map.getRoomTerrain('W0N0');
    var cameraEl = document.getElementById('camera');
    if (cameraEl) {
        cameraEl.style.transform = 'rotate(' + rotateAngle + 'deg)';
    }
}

function handleRotateBack() {
    rotateAngle = 0;
    var cameraEl = document.getElementById('camera');
    if (cameraEl) {
        cameraEl.style.transform = 'rotate(0deg)';
    }
}

function render() {
    var html = '<div class="container">';
    html += '<h2>Console</h2>';
    html += '<p>Press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste code and press <kbd>Enter</kbd> to run.</p>';
    html += '<p>You can use <code>Game.spawns["Spawn1"].room.find(FIND_MY_CREEPS)</code> to find your creeps.</p>';
    html += '<button id="unrotate" onClick="handleRotateBack()">rotate back</button>';
    html += '<div id="console"></div>';
    html += '<input id="console-input" placeholder="Enter code..." />';
    html += '</div>';
    html += '<div class="container" id="camera"><div class="camera-layer"></div></div>';
    return html;
}

console.log('Main module loaded');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initial setup code
});

module.exports = {
    loop: loop,
    render: render
};