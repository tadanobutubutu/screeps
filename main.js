for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
        roleHarvester.run(creep);
    }
    if (creep.memory.role === 'upgrader') {
        roleUpgrader.run(creep);
    }
}

// React_025 fix: ensure only one <main> landmark is present.
// Replace any additional <main> tags with <section> or <article> as needed.
var rotateBackButton = document.getElementById('unrotate');
if (rotateBackButton) {
    rotateBackButton.onclick = function() {
        // Add your logic here for the "rotate back" action
        console.log('Rotating back...');
    };
}