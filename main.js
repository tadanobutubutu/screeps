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
 *  Helper – safely require Jest for testing
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
 *  New helper function for testing
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