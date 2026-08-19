// main.js - Screeps bot logic
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

// ... existing code ...

// Rotate functionality with accessible button
function createRotateButton() {
    return '<button id="unrotate" type="button">rotate back</button>';
}

// ... existing code ...

module.exports = {
    roleHarvester,
    roleUpgrader,
    roleBuilder
};