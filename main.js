'use strict';

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        return undefined;
    }
}

/* Mock globals for testing environments (e. g., Jest) */
if (typeof global.Animats === 'undefined') global.Animats = {};
if (typeof global.ConstructionSites === 'undefined') global.ConstructionSites = {};
if (typeof global.Creep === 'undefined') global.Creep = function () {};
if (typeof global.Flag === 'undefined') global.Flag = function () {};
if (typeof global.Game === 'undefined') {
    global.Game = { creeps: {}, flags: {}, rooms: {}, spawns: {} };
}
if (typeof global.Map === 'undefined') global.Map = {};
if (typeof global.Memory === 'undefined') global.Memory = {};
if (typeof global.PathFinder === 'undefined') global.PathFinder = {};
if (typeof global.RawMemory === 'undefined') global.RawMemory = {};
if (typeof global.Room === 'undefined') global.Room = function () {};
if (typeof global.RoomPosition === 'undefined') global.RoomPosition = function () {};
if (typeof global.Structure === 'undefined') global.Structure = function () {};
if (typeof global.StructureContainer === 'undefined') global.StructureContainer = function () {};
if (typeof global.StructureController === 'undefined') global.StructureController = function () {};
if (typeof global.StructureExtension === 'undefined') global.StructureExtension = function () {};
if (typeof global.StructureRampart === 'undefined') global.StructureRampart = function () {};
if (typeof global.StructureRoad === 'undefined') global.StructureRoad = function () {};
if (typeof global.StructureSpawn === 'undefined') global.StructureSpawn = function () {};
if (typeof global.StructureTower === 'undefined') global.StructureTower = function () {};
if (typeof global.StructureWall === 'undefined') global.StructureWall = function () {};
if (typeof global.OK === 'undefined') global.OK = 0;
if (typeof global.ERR_NOT_OWNER === 'undefined') global.ERR_NOT_OWNER = -1;
if (typeof global.ERR_NO_PATH === 'undefined') global.ERR_NO_PATH = -2;

/* ------------------------------------------------------------------
 *  New helper function for testing
 * ------------------------------------------------------------------ */
function safeRequireJest() {
    try {
        // Try to require Jest directly
        return require('jest');
    } catch (e) {
        try {
            // Try to require Jest from node_modules
            return require('./node_modules/jest');
        } catch (e) {
            // If Jest isn't available, return a mock object
            return {
                run: function () {
                    return Promise.resolve({ success: false });
                },
            };
        }
    }
}

// Export the safeRequireJest function for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        safeRequire,
        safeRequireJest,
    };
}

/* ------------------------------------------------------------------
 *  New creep role: Autonomous Efficiency
 *  Concept: A versatile creep that autonomously switches tasks based on
 *  priority and availability, maximizing efficiency without explicit role assignment
 * ------------------------------------------------------------------ */

/**
 * Autonomous Efficiency creep role
 * This creep autonomously manages its tasks based on current game state,
 * prioritizing critical actions and adapting to changing conditions
 * @param {Creep} creep - The creep object to manage
 */
function runAutonomousEfficiency(creep) {
    // Priority 1: Upgrade controller if near and no other creeps are upgrading
    if (creep.store[RESOURCE_ENERGY] > 0) {
        const controller = creep.room.controller;
        if (controller && creep.pos.isNearTo(controller)) {
            const upgradingCreeps = _.filter(
                Game.creeps,
                (c) => c.memory.role === 'upgrader' && c.store[RESOURCE_ENERGY] > 0
            );
            if (upgradingCreeps.length === 0) {
                if (creep.upgradeController(controller) === ERR_NOT_OWNER) {
                    // Try to claim if not owner
                    creep.claimController(controller);
                }
                return;
            }
        }
    }

    // Priority 2: Build or repair structures
    if (creep.store[RESOURCE_ENERGY] > 0) {
        // First, look for construction sites
        const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionSite) {
            if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite, { visualizePath: true });
            }
            return;
        }

        // If no construction sites, look for damaged structures
        const damagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL,
        });
        if (damagedStructure) {
            if (creep.repair(damagedStructure) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedStructure, { visualizePath: true });
            }
            return;
        }
    }

    // Priority 3: Harvest energy from nearest source
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source) {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePath: true });
        }
        return;
    }

    // Priority 4: Transfer energy to nearest structure needing it
    if (creep.store[RESOURCE_ENERGY] > 0) {
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) =>
                s.structureType !== STRUCTURE_SPAWN &&
                s.structureType !== STRUCTURE_CONTROLLER &&
                s.store &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePath: true });
            }
        }
    }
}

/**
 * Autonomous Efficiency creep behavior pattern
 * Adapts dynamically to room needs without explicit role assignment
 */
const autonomousEfficiencyRole = {
    run: runAutonomousEfficiency,

    /**
     * Determine if this creep should be assigned to autonomous efficiency
     * @param {Object} memory - The creep's memory object
     * @returns {boolean} - Whether this creep should be autonomous
     */
    shouldAssign: function (memory) {
        return memory.role === 'autonomous';
    },

    /**
     * Create a new autonomous efficiency creep
     * @param {string} name - The creep's name
     * @param {Spawn} spawn - The spawn to create the creep at
     * @param {Object} body - The body composition (default: [WORK, CARRY, MOVE])
     * @returns {string|undefined} - The result code or undefined if successful
     */
    create: function (name, spawn, body = [WORK, CARRY, MOVE]) {
        if (spawn.spawning) {
            return;
        }
        const result = spawn.spawnCreep(body, name, {
            memory: { role: 'autonomous', state: 'harvesting' },
        });
        return result;
    },
};

/* ------------------------------------------------------------------
 *  Export the new role
 * ------------------------------------------------------------------ */
if (typeof module !== 'undefined' && module.exports) {
    module.exports.autonomousEfficiency = autonomousEfficiencyRole;
    module.exports.runAutonomousEfficiency = runAutonomousEfficiency;
}

/* ------------------------------------------------------------------
 *  Test helper function
 * ------------------------------------------------------------------ */
function testGlobalFunctions() {
    // Ensure global functions are defined
    expect(typeof global.Creep).toBe('function');
    expect(typeof global.Flag).toBe('function');
    expect(typeof global.PathFinder).toBe('function');
    expect(typeof global.RawMemory).toBe('object');
    expect(typeof global.RoomPosition).toBe('function');
    expect(typeof global.Structure).toBe('function');
    expect(typeof global.OK).toBe('number');
    expect(typeof global.ERR_NOT_OWNER).toBe('number');
    expect(typeof global.ERR_NO_PATH).toBe('number');
}

/* Export the test function for running in tests */
if (typeof module !== 'undefined' && module.exports) {
    module.exports.testGlobalFunctions = testGlobalFunctions;
}

/* ------------------------------------------------------------------
 *  Carrier Role – Autonomous Efficiency
 *  Handles efficient resource transport between sources and consumers
 * ------------------------------------------------------------------ */

/**
 * Carrier role module for autonomous resource transportation
 * Dynamically generates efficient routes between resource providers and consumers
 */
const carrier = {
    name: 'carrier',

    /**
     * Run the carrier role logic for a creep
     * @param {Creep} creep - The creep to run the role for
     */
    run: function (creep) {
        if (creep.memory.transportTarget && creep.carry[RESOURCE_ENERGY] > 0) {
            // Deliver resources to target
            const target = Game.getObjectById(creep.memory.transportTarget);
            if (target) {
                const result = creep.transfer(target, RESOURCE_ENERGY);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else if (result === OK) {
                    delete creep.memory.transportTarget;
                    delete creep.memory.pickupTarget;
                }
            } else {
                delete creep.memory.transportTarget;
            }
        } else if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
            // Pick up resources
            const pickupTarget = Game.getObjectById(creep.memory.pickupTarget);
            if (pickupTarget) {
                if (pickupTarget.amount !== undefined) {
                    // It's a dropped resource
                    const result = creep.pickup(pickupTarget);
                    if (result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(pickupTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
                    } else if (result === OK || result === ERR_FULL) {
                        delete creep.memory.pickupTarget;
                    }
                } else if (pickupTarget.store !== undefined) {
                    // It's a structure with store
                    const result = creep.withdraw(pickupTarget, RESOURCE_ENERGY);
                    if (result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(pickupTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
                    } else if (result === OK) {
                        delete creep.memory.pickupTarget;
                    }
                }
            } else {
                delete creep.memory.pickupTarget;
            }
        }

        // Idle state if nothing to do
        if (!creep.memory.pickupTarget && !creep.memory.transportTarget) {
            // Find efficient pickup target
            this.findPickupTarget(creep);
        }
    },

    /**
     * Find the most efficient pickup target for the carrier
     * @param {Creep} creep - The carrier creep
     * @returns {boolean} - Whether a target was found
     */
    findPickupTarget: function (creep) {
        // Look for dropped resources near the creep
        const droppedResources = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: (resource) => resource.amount > 50,
        });

        if (droppedResources.length > 0) {
            // Find the closest one
            const closest = creep.pos.findClosestByRange(droppedResources);
            if (closest) {
                creep.memory.pickupTarget = closest.id;
                return true;
            }
        }

        // Look for containers with energy
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                (structure.structureType === STRUCTURE_CONTAINER ||
                    structure.structureType === STRUCTURE_STORAGE) &&
                structure.store[RESOURCE_ENERGY] > 100,
        });

        if (containers.length > 0) {
            const closest = creep.pos.findClosestByRange(containers);
            if (closest) {
                creep.memory.pickupTarget = closest.id;
                return true;
            }
        }

        return false;
    },

    /**
     * Assign a transport target for the carrier
     * @param {Creep} creep - The carrier creep
     * @param {string} targetId - The ID of the target structure
     */
    assignTransportTarget: function (creep, targetId) {
        creep.memory.transportTarget = targetId;
    },
};

// Export the carrier role
if (typeof module !== 'undefined' && module.exports) {
    module.exports = carrier;
}

/* ------------------------------------------------------------------
 *  Dynamic Role Registry
 *  Allows for dynamic registration and management of creep roles
 * ------------------------------------------------------------------ */

/**
 * Role registry for dynamic role management
 */
const roleRegistry = {
    roles: {},

    /**
     * Register a new role dynamically
     * @param {string} name - The role name
     * @param {object} roleModule - The role module with run function
     */
    register: function (name, roleModule) {
        this.roles[name] = roleModule;
    },

    /**
     * Get a role by name
     * @param {string} name - The role name
     * @returns {object|null} - The role module or null
     */
    get: function (name) {
        return this.roles[name] || null;
    },

    /**
     * Get all registered role names
     * @returns {string[]} - Array of role names
     */
    getRoleNames: function () {
        return Object.keys(this.roles);
    },

    /**
     * Initialize default roles
     */
    initDefaultRoles: function () {
        // Register carrier role
        this.register('carrier', carrier);

        // Placeholder for other roles (can be loaded dynamically)
        const defaultRoles = ['builder', 'defender', 'harvester', 'miner', 'repairer', 'upgrader'];
        defaultRoles.forEach((roleName) => {
            if (!this.roles[roleName]) {
                try {
                    const roleModule = require(`./${roleName}.js`);
                    this.register(roleName, roleModule);
                } catch (e) {
                    // Role file doesn't exist yet, skip
                }
            }
        });
    },
};

// Initialize default roles on load
roleRegistry.initDefaultRoles();

// Export the role registry
if (typeof module !== 'undefined' && module.exports) {
    module.exports.roleRegistry = roleRegistry;
}

// Add test functions for global commands
if (typeof module !== 'undefined' && module.exports) {
    module.exports.testGlobalCommands = function () {
        // Mock global commands for testing
        global.gr = function () {};
        global.evor = function () {};

        // Test that the functions exist
        expect(typeof global.gr).toBe('function');
        expect(typeof global.evor).toBe('function');
    };
}
