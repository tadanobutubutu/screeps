// main.js - Screeps game code
// Note: This file contains JavaScript, not JSX/React
// The accessibility issue appears to be in a separate HTML/JSX file

// Example of a React component that would need scope attributes (if applicable):
// In your JSX/React table component:

/*
<table>
  <thead>
    <tr>
      <th scope="col">Header 1</th>
      <th scope="col">Header 2</th>
      <th scope="col">Header 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Row Header</th>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
*/

// Your actual Screeps main.js code should remain unchanged:
// It's likely this file only contains game logic (no HTML/JSX tables)

// Example typical structure:
module.exports.loop = function() {
    // Game logic here
    for (let name in Game.rooms) {
        console.log('Room "' + name + '" has ' + Game.rooms[name].find(FIND_HOSTILE_CREEPS).length + ' enemies');
    }
    
    for (let i in Game.creeps) {
        const creep = Game.creeps[i];
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};