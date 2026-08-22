var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports = {
  table: [
    { name: 'Test Table', headers: ['Column 1', 'Column 2'] },
    { name: 'Data', rows: [['A', 'B']] }
  ],

  renderTable: function() {
    return `
      <table>
        <thead>
          <tr>
            <th scope="col">Column 1</th>
            <th scope="col">Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A</td>
            <td>B</td>
          </tr>
        </tbody>
      </table>
    `;
  },

  loop: function() {
    var towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
    for (var tower of towers) {
      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower.attack(closestHostile);
      }
    }

    for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      if (creep.memory.role === 'harvester') {
        roleHarvester.run(creep);
      } else if (creep.memory.role === 'upgrader') {
        roleUpgrader.run(creep);
      } else if (creep.memory.role === 'builder') {
        roleBuilder.run(creep);
      }
    }
  }
};