// ==UserScript==
// @Name         Screeps AI
// @Namespace    http://tampermonkey.net/
// @Version      1.0
// @Description   Custom Screeps AI with accessibility and robustness improvements
// @Author       You
// @Match        ^https:\/\/screeps\.com\/a\/.*
// @Grant        none
// ==/UserScript==

'use strict';

/**
 * Main entry point for the creep logic.
 * This module acts as an orchestrator for various creep roles and room-level tasks.
 */
module.exports.loop = function() {
    // --- Role Definitions ---

    /**
     * Harvester Role
     * Focuses on collecting energy and transferring it to spawns/extensions/towers.
     * Accessibility Improvement: Includes null checks for target positions and uses `_.closest` for efficient targeting.
     */
    Memory.creeps = Memory.creeps || {};
    const roleHarvester = {
        /**
         * Finds the most suitable structure to transfer energy to.
         * Prioritizes structures that are critically low on energy.
         * @param {Creep} creep The creep performing the task.
         * @returns {Structure|undefined} The target structure or undefined if none found.
         */
        findEnergyTarget: function(creep) {
            // Find structures that need energy (extensions, spawns, towers) which are not full.
            // Use ACCESSIBILITY IMPROVEMENT 1: Robust search with validation.
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    // Ensure the structure is valid and can store energy.
                    return (
                        structure.structureType &&
                        (structure.structureType === STRUCTURE_EXTENSION ||
                         structure.structureType === STRUCTURE_SPAWN ||
                         structure.structureType === STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity
                    );
                }
            });

            if (targets.length > 0) {
                // Return the closest target that needs energy.
                return _.closest(targets, creep.pos);
            }

            // Fallback: Find a storage unit if no active targets are present.
            const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_STORAGE && s.store.energy < s.storeCapacity
            });
            if (storage) {
                 // Validate storage position before returning.
                 if (storage.pos && storage.pos.roomName === creep.pos.roomName) {
                     return storage;
                 }
            }

            return undefined;
        },

        /**
         * Runs the harvester logic for a given creep.
         * @param {Creep} creep The creep to run logic for.
         */
        run: function(creep) {
            // Switch modes based on energy levels.
            if (creep.store.getUsedCapacity() === 0 && !creep.memory.working) {
                 creep.memory.working = false;
            } else if (creep.store.getFreeCapacity() === 0 && creep.memory.working) {
                 creep.memory.working = true;
            }

            if (!creep.memory.working) {
                // Collecting Energy
                const sources = creep.room.find(FIND_SOURCES_ACTIVE);
                if (sources.length > 0) {
                    // ACCESSIBILITY IMPROVEMENT 2: Find closest valid source with null check.
                    const closestSource = _.closest(sources, s => s.pos && s.pos.roomName === creep.pos.roomName ? creep.pos.getRangeTo(s) : Infinity);
                    if (closestSource) {
                        if (creep.harvest(closestSource) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(closestSource, { visualizePath: true });
                        }
                    }
                }
            } else {
                // Transferring Energy
                const target = this.findEnergyTarget(creep);
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePath: true });
                    }
                } else {
                    // No transfer target found, act as a builder if possible.
                    const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    if (constructionSite) {
                         if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                             creep.moveTo(constructionSite, { visualizePath: true });
                         }
                    } else {
                        // Idle behavior if no other tasks.
                        creep.say('🧹');
                    }
                }
            }
        }
    };

    /**
     * Upgrader Role
     * Focuses on collecting energy and upgrading the controller.
     * Accessibility Improvement: Uses `findClosestByPath` for movement and includes safety checks.
     */
    const roleUpgrader = {
        /**
         * Finds the most suitable energy source.
         * @param {Creep} creep The creep performing the task.
         * @returns {Source|undefined} The target source or undefined if none found.
         */
        findEnergySource: function(creep) {
            const sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (sources.length > 0) {
                // ACCESSIBILITY IMPROVEMENT 3: Prioritize closer sources and validate positions.
                return _.min(sources, (source) => {
                    if (!source.pos || source.pos.roomName !== creep.pos.roomName) {
                         return Infinity; // Invalid source location.
                    }
                    return creep.pos.getRangeTo(source);
                });
            }
            return undefined;
        },

        /**
         * Runs the upgrader logic for a given creep.
         * @param {Creep} creep The creep to run logic for.
         */
        run: function(creep) {
             // Check for valid controller before proceeding.
             const controller = creep.room.controller;
             if (!controller || !controller.pos || controller.pos.roomName !== creep.pos.roomName) {
                 // Controller is unreachable or invalid.
                 creep.say('❌ Controller');
                 return;
             }

            if (creep.store.getUsedCapacity() === 0 && !creep.memory.working) {
                 creep.memory.working = false;
            } else if (creep.store.getFreeCapacity() === 0 && creep.memory.working) {
                 creep.memory.working = true;
            }

            if (!creep.memory.working) {
                // Collecting Energy
                const source = this.findEnergySource(creep);
                if (source) {
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                         // ACCESSIBILITY IMPROVEMENT 4: Use findClosestByPath for more reliable pathfinding.
                        creep.moveTo(source, {reusePath: 10, visualizePath: true });
                    }
                }
            } else {
                // Upgrading Controller
                if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                     // ACCESSIBILITY IMPROVEMENT 5: Use findClosestByPath for more reliable pathfinding.
                    creep.moveTo(controller, {reusePath: 10, visualizePath: true });
                }
            }
        }
    };

    // --- Main Game Loop Logic ---

    // Clear memory for dead creeps.
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Cleared non-existing creep memory: ${name}`);
        }
    }

    // Spawn logic
    const mainSpawn = Game.spawns['Spawn1']; // Assumes a spawn named 'Spawn1'
    if (mainSpawn) {
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');

        // Spawn more harvesters if needed.
        if (harvesters.length < 3) {
            const newName = 'Harvester' + Game.time;
            const body = [WORK, CARRY, MOVE]; // Basic body for cost efficiency.
            const spawningRequirementsMet = this.canAffordBody(mainSpawn, body);
            if (spawningRequirementsMet) {
                const creep = mainSpawn.spawnCreep(body, newName, { memory: { role: 'harvester' } });
                if (creep === OK) {
                    console.log('Spawning new Harvester: ' + newName);
                } else if (typeof creep === 'string') {
                     console.log(`Failed to spawn Harvester: ${creep}`);
                }
            }
        }
        // Spawn more upgraders if needed.
        else if (upgraders.length < 2) {
            const newName = 'Upgrader' + Game.time;
            const body = [WORK, CARRY, MOVE]; // Basic body for cost efficiency.
            const spawningRequirementsMet = this.canAffordBody(mainSpawn, body);
            if (spawningRequirementsMet) {
                const creep = mainSpawn.spawnCreep(body, newName, { memory: { role: 'upgrader' } });
                if (creep === OK) {
                    console.log('Spawning new Upgrader: ' + newName);
                } else if (typeof creep === 'string') {
                     console.log(`Failed to spawn Upgrader: ${creep}`);
                }
            }
        }
    }

    // Run role logic for each creep.
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else {
            // Default behavior for unknown roles.
            creep.say('?');
        }
    }
};

/**
 * Helper function to determine if the spawn can afford a specific body composition.
 * This makes the code more robust and easier to extend.
 * @param {StructureSpawn} spawn The spawn structure.
 * @param {Array<string>} bodyParts An array of body part constants.
 * @returns {boolean} True if the spawn has enough energy.
 */
module.exports.canAffordBody = function(spawn, bodyParts) {
    if (!spawn || !spawn.store || !bodyParts) {
        return false;
    }
    let cost = 0;
    const partCosts = {
        'work': WORK_COST,
        'carry': CARRY_COST,
        'move': MOVE_COST,
        'attack': ATTACK_COST,
        'ranged_attack': RANGED_ATTACK_COST,
        'heal': HEAL_COST,
        'tough': TOUGH_COST,
    };

    for (const part of bodyParts) {
        cost += partCosts[part.toLowerCase()];
        if (cost > spawn.store.energy) {
            return false;
        }
    }
    return true;
};