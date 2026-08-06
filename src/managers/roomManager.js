const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');

const roomManager = {
    run: function (room) {
        if (!room || !room.controller || !room.controller.my) {
            return;
        }

        // Link energy transfer (links transfer energy)
        const links = cache.getLinks(room) || [];
        if (links.length >= 2) {
            // Find source and sink links
            const spawns = cache.getSpawns(room) || [];
            if (spawns.length > 0) {
                const spawn = spawns[0];
                const sink = pathfinder.closest(spawn, links);
                if (sink) {
                    links.forEach((link) => {
                        if (link !== sink && link.cooldown === 0 && link.store && link.store[global.RESOURCE_ENERGY] >= 800) {
                            link.transferEnergy(sink);
                        }
                    });
                }
            }
        }

        // Threat handling (Safe Mode)
        const enemies = cache.getEnemies(room) || [];
        if (enemies.length >= 3) {
            if (room.controller.activateSafeMode) {
                room.controller.activateSafeMode();
            }
        }

        // Construction planning
        if (global.Game.time % 50 === 0) {
            this._planSourceContainers(room);
            this._planRoads(room);
        }

        // Cleanup memory
        if (global.Game.time % 100 === 0) {
            this._cleanupRoomMemory(room);
        }
    },

    getStats: function (room) {
        const stats = {
            name: room.name,
            rcl: room.controller ? room.controller.level : 0,
            energy: room.energyAvailable || 0,
            energyCapacity: room.energyCapacityAvailable || 0,
            controllerProgress: room.controller ? room.controller.progress : 0,
            safeMode: room.controller ? !!room.controller.safeMode : false,
            storageEnergy: room.storage ? (room.storage.store[global.RESOURCE_ENERGY] || 0) : 0,
            creepCounts: Object.create(null)
        };

        const creeps = cache.getMyCreeps(room) || [];
        creeps.forEach((creep) => {
            if (creep && creep.room && creep.room.name === room.name && creep.memory && creep.memory.role) {
                const role = creep.memory.role;
                stats.creepCounts[role] = (stats.creepCounts[role] || 0) + 1;
            }
        });

        return stats;
    },

    showStats: function (room) {
        const stats = this.getStats(room);
        console.log(`Room ${stats.name}: RCL ${stats.rcl}, Energy ${stats.energy}/${stats.energyCapacity}`);
    },

    showVisuals: function (room) {
        if (room.visual) {
            room.visual.text(`Room: ${room.name}`, 1, 1);
        }
    },

    _getNeededExtensionCount: function (room) {
        if (!room || !room.controller) {
            return 0;
        }
        const rcl = room.controller.level;
        const maxExtensions = (global.CONTROLLER_STRUCTURES && global.CONTROLLER_STRUCTURES.extension && global.CONTROLLER_STRUCTURES.extension[rcl]) || 0;
        if (maxExtensions === 0) {
            return 0;
        }

        const existing = (cache.getMyStructures(room) || []).filter(s => s.structureType === undefined || s.structureType === global.STRUCTURE_EXTENSION).length;
        const sites = (cache.getConstructionSites(room) || []).filter(s => s.structureType === global.STRUCTURE_EXTENSION).length;
        const needed = maxExtensions - (existing + sites);
        return Math.max(0, Math.min(5, needed));
    },

    _planSourceContainers: function (room) {
        if (!room || !room.controller || room.controller.level < 2) {
            return;
        }
        const sources = cache.getSources(room) || [];
        const containers = cache.getContainers(room) || [];
        const sites = cache.getConstructionSites(room) || [];

        sources.forEach((source) => {
            const hasContainer = containers.some(c => source.pos.getRangeTo(c) <= 2);
            const hasSite = sites.some(s => s.structureType === global.STRUCTURE_CONTAINER && source.pos.getRangeTo(s) <= 2);

            if (!hasContainer && !hasSite) {
                const openTile = pathfinder.findNearestOpenTile(source.pos);
                if (openTile) {
                    const result = room.createConstructionSite(openTile.x, openTile.y, global.STRUCTURE_CONTAINER);
                    if (result === global.OK) {
                        cache.invalidate(`construction_sites_${room.name}`);
                    }
                }
            }
        });
    },

    _planRoads: function (room) {
        const spawns = cache.getSpawns(room) || [];
        if (spawns.length === 0) {
            return;
        }
        const sources = cache.getSources(room) || [];
        const structures = cache.getStructures(room) || [];
        const sites = cache.getConstructionSites(room) || [];

        const MAX_ROADS_PER_CYCLE = 5;

        let sourceRoadCount = 0;
        sources.forEach((source) => {
            spawns.forEach((spawn) => {
                const pathResult = pathfinder.findPath(spawn.pos, source.pos);
                if (pathResult && !pathResult.incomplete && pathResult.path) {
                    pathResult.path.forEach((pos) => {
                        const isOccupied = structures.some(s => s.pos.x === pos.x && s.pos.y === pos.y) ||
                                           sites.some(s => s.pos.x === pos.x && s.pos.y === pos.y);
                        if (!isOccupied && sourceRoadCount < MAX_ROADS_PER_CYCLE) {
                            const result = room.createConstructionSite(pos.x, pos.y, global.STRUCTURE_ROAD);
                            if (result === global.OK) {
                                sourceRoadCount++;
                                cache.invalidate(`construction_sites_${room.name}`);
                            }
                        }
                    });
                }
            });
        });

        // Controller roads
        if (room.controller) {
            let controllerRoadCount = 0;
            spawns.forEach((spawn) => {
                const pathResult = pathfinder.findPath(spawn.pos, room.controller.pos);
                if (pathResult && !pathResult.incomplete && pathResult.path) {
                    pathResult.path.forEach((pos) => {
                        const isOccupied = structures.some(s => s.pos.x === pos.x && s.pos.y === pos.y) ||
                                           sites.some(s => s.pos.x === pos.x && s.pos.y === pos.y);
                        if (!isOccupied && controllerRoadCount < MAX_ROADS_PER_CYCLE) {
                            const result = room.createConstructionSite(pos.x, pos.y, global.STRUCTURE_ROAD);
                            if (result === global.OK) {
                                controllerRoadCount++;
                                cache.invalidate(`construction_sites_${room.name}`);
                            }
                        }
                    });
                }
            });
        }
    },

    _cleanupRoomMemory: function (room) {
        if (room && room.name && global.Memory && global.Memory.rooms) {
            const keys = Object.keys(global.Memory.rooms);
            keys.forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(global.Memory.rooms, key) && key === room.name) {
                    // Clean up room memory if corrupted
                }
            });
        }
    }
};

module.exports = roomManager;
