const fs = require('fs');
let code = fs.readFileSync('tutorial.auto.js', 'utf8');

if (!code.includes('/* global Game, FIND_SOURCES, ERR_NOT_IN_RANGE, RESOURCE_ENERGY, FIND_CONSTRUCTION_SITES, FIND_HOSTILE_CREEPS, STRUCTURE_TOWER, WORK, CARRY, MOVE, _ */')) {
    code = '/* global Game, FIND_SOURCES, ERR_NOT_IN_RANGE, RESOURCE_ENERGY, FIND_CONSTRUCTION_SITES, FIND_HOSTILE_CREEPS, STRUCTURE_TOWER, WORK, CARRY, MOVE, _ */\n' + code;
}

fs.writeFileSync('tutorial.auto.js', code);
