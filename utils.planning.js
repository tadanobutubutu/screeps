// Room Planning Utilities
// Basic implementations inspired by Distance Transform and Floodfill concepts

const cache = require('./src/utils/cache');

module.exports = {
    // Find open spaces in a room (simplified Distance Transform concept)
    findOpenSpaces: function (room, minSize = 3) {
        const terrain = room.getTerrain();
        const openSpaces = [];

        // Scan room for open areas
        for (let x = minSize; x < 50 - minSize; x++) {
            for (let y = minSize; y < 50 - minSize; y++) {
                if (this.isOpenArea(room, x, y, minSize, terrain)) {
                    openSpaces.push({ x, y, size: minSize });
                }
            }
        }

        return openSpaces;
    },

    // Check if an area is open (no walls/terrain)
    isOpenArea: function (room, centerX, centerY, size, terrain) {
        terrain = terrain || room.getTerrain();

        for (let dx = -size; dx <= size; dx++) {
            for (let dy = -size; dy <= size; dy++) {
                const x = centerX + dx;
                const y = centerY + dy;

                if (x < 0 || x >= 50 || y < 0 || y >= 50) {
                    return false;
                }
                if (terrain.get(x, y) === TERRAIN_MASK_WALL) {
                    return false;
                }
            }
        }

        return true;
    },

    // Find best position for spawn near controller and sources
    findBestSpawnPosition: function (room) {
        const controller = room.controller;
        const sources = cache.getSources(room);

        if (!controller || sources.length === 0) {
            return null;
        }

        const openSpaces = this.findOpenSpaces(room, 2);
        let bestPos = null;
        let bestScore = Infinity;

        openSpaces.forEach((space) => {
            const pos = new RoomPosition(space.x, space.y, room.name);

            // Calculate distance score (lower is better)
            const controllerDist = pos.getRangeTo(controller);
            const sourceDist = Math.min(...sources.map((s) => pos.getRangeTo(s)));
            const score = controllerDist * 2 + sourceDist;

            if (score < bestScore) {
                bestScore = score;
                bestPos = pos;
            }
        });

        return bestPos;
    },

    // Get tiles at a certain distance from a position (Floodfill concept)
    getTilesAtDistance: function (room, centerPos, distance) {
        const tiles = [];
        const terrain = room.getTerrain();

        for (
            let x = Math.max(0, centerPos.x - distance);
            x <= Math.min(49, centerPos.x + distance);
            x++
        ) {
            for (
                let y = Math.max(0, centerPos.y - distance);
                y <= Math.min(49, centerPos.y + distance);
                y++
            ) {
                if (Math.abs(x - centerPos.x) + Math.abs(y - centerPos.y) === distance) {
                    if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                        tiles.push(new RoomPosition(x, y, room.name));
                    }
                }
            }
        }

        return tiles;
    },

    // Visualize room planning
    visualizePlanning: function (room, positions, color = '#00ff00') {
        if (!positions || positions.length === 0) {
            return;
        }

        positions.forEach((pos) => {
            room.visual.circle(pos.x, pos.y, {
                radius: 0.4,
                fill: color,
                opacity: 0.5,
            });
        });
    },

    // Find positions for road network between key structures
    planRoadNetwork: function (room) {
        // ⚡ PERFORMANCE OPTIMIZATION: Use getSpawns cache to avoid redundant room.find calls.
        const spawns = cache.getSpawns(room);
        if (spawns.length === 0) {
            return [];
        }
        const spawn = spawns[0];
        const controller = room.controller;

        if (controller === undefined || controller === null) {
            return [];
        }

        return cache.get(
            `road_network_${room.name}`,
            () => {
                const sources = cache.getSources(room);
                const roadPositions = [];

                if (!spawn || !spawn.pos) return roadPositions;

                const costs = new PathFinder.CostMatrix();
                const OBSTACLE_OBJECT_TYPES = ["spawn", "constructedWall", "extension", "link", "storage", "tower", "observer", "powerSpawn", "extractor", "lab", "terminal", "nuker", "factory"];

                // ⚡ PERFORMANCE OPTIMIZATION: populate CostMatrix manually instead of relying on findPathTo
                if (room.find) {
                    const structures = room.find(FIND_STRUCTURES);
                    for (let i = 0; i < structures.length; i++) {
                        const struct = structures[i];
                        if (OBSTACLE_OBJECT_TYPES.includes(struct.structureType) ||
                            (struct.structureType === STRUCTURE_RAMPART && !struct.my)) {
                            costs.set(struct.pos.x, struct.pos.y, 255);
                        }
                    }

                    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
                    for (let i = 0; i < constructionSites.length; i++) {
                        const site = constructionSites[i];
                        if (OBSTACLE_OBJECT_TYPES.includes(site.structureType) ||
                            (site.structureType === STRUCTURE_RAMPART && !site.my)) {
                            costs.set(site.pos.x, site.pos.y, 255);
                        }
                    }
                }

                // Block sources and controllers
                sources.forEach(s => costs.set(s.pos.x, s.pos.y, 255));
                if (controller) costs.set(controller.pos.x, controller.pos.y, 255);
                const minerals = room.find ? room.find(FIND_MINERALS) : [];
                minerals.forEach(m => costs.set(m.pos.x, m.pos.y, 255));

                const goals = [{ pos: spawn.pos, range: 1 }];
                const targets = [...sources];
                if (controller) targets.push(controller);

                // ⚡ PERFORMANCE OPTIMIZATION: Use PathFinder.search and update goals/costs to reuse road segments
                for (let i = 0; i < targets.length; i++) {
                    const target = targets[i];
                    const ret = PathFinder.search(target.pos, goals, {
                        plainCost: 2,
                        swampCost: 10,
                        roomCallback: function(roomName) {
                            if (roomName !== room.name) return false;
                            return costs;
                        }
                    });

                    for (let j = 0; j < ret.path.length; j++) {
                        const pos = ret.path[j];
                        roadPositions.push(pos);
                        goals.push({ pos: pos, range: 1 });
                        costs.set(pos.x, pos.y, 1);
                    }
                }

                return roadPositions;
            },
            1000
        ); // Cache the road network for 1000 ticks
    },

    // Display planning info
    displayPlanningInfo: function (room) {
        const openSpaces = this.findOpenSpaces(room, 3);
        const bestSpawnPos = this.findBestSpawnPosition(room);

        if (bestSpawnPos) {
        }

        return { openSpaces, bestSpawnPos };
    },
};
