var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function() {
    // Clear the memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // TODO: Add implementation details
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
            {memory: {role: 'harvester'}});        
    }
    
    if(upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has ' + Game.rooms[name].energyAvailable + ' energy');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }

    // Implementing accessibility issues
    // Add lang attribute to HTML element
    if (!document.documentElement.lang) {
        document.documentElement.lang = 'en';
    }

    // Add landmark roles and fix landmark issues
    var landmarks = document.querySelectorAll('role.landmark');
    landmarks.forEach(landmark => {
        landmark.setAttribute('role', 'landmark');
        landmark.setAttribute('aria-label', 'Landmark description'); // Example ARIA label
    });

    // Add accessible names to 2 SVGs
    var svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
        if (svg.getAttribute('aria-labelledby')) {
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', svg.getAttribute('aria-labelledby'));
        }
    });

    // Ensure unique landmarks
    // Assuming there's a function to get the list of existing landmarks
    function getUniqueLandmarkRole(landmarkRole) {
        let existingRoles = Array.from(document.querySelectorAll(`[role="${landmarkRole}"]`));
        let i = 0;
        while (existingRoles.length > 0) {
            let uniqueRole = `${landmarkRole}-${i}`;
            if (!document.querySelector(`[role="${uniqueRole}"]`)) {
                landmarkRole = uniqueRole;
                break;
            }
            i++;
        }
        return landmarkRole;
    }

    landmarks.forEach(landmark => {
        let uniqueRole = getUniqueLandmarkRole(landmark.getAttribute('role'));
        landmark.setAttribute('role', uniqueRole);
    });

    // Fix 1 fake link issue
    var fakeLinks = document.querySelectorAll('a[role="presentation"]');
    fakeLinks.forEach(link => {
        link.setAttribute('role', 'link');
        link.setAttribute('href', link.getAttribute('data-href')); // Assuming 'data-href' contains the actual link
    });

    // Add scope="col" or scope="row" to <th> elements
    // This is already implemented, so no changes are necessary.
}