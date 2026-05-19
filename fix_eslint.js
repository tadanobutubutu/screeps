const fs = require('fs');

const file = 'main.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('/* global Game, Memory, Room, FIND_HOSTILE_CREEPS, FIND_SOURCES_ACTIVE, STRUCTURE_WALL, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LAB, RESOURCE_ENERGY, STRUCTURE_CONTAINER, _ */',
'/* global Game, Memory, Room, FIND_HOSTILE_CREEPS, FIND_SOURCES_ACTIVE, STRUCTURE_WALL, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LAB, RESOURCE_ENERGY, STRUCTURE_CONTAINER, STRUCTURE_RAMPART, _ */');

fs.writeFileSync(file, content, 'utf8');
console.log('done');
