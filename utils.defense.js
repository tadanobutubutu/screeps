const cache = require('./src/utils/cache');

const DefenseManager = {
    findTowerTargets(room) {
        const towers = cache.getMyStructures(room, STRUCTURE_TOWER);

        const hostiles = cache.getEnemies(room);
        const allStructures = cache.getStructures(room);
        const damagedStructures = [];
        const damagedWalls = [];
        for (let i = 0; i < allStructures.length; i++) {
            const s = allStructures[i];
            if (s.structureType === STRUCTURE_WALL) {
                if (s.hits < 100000) damagedWalls.push(s);
            } else {
                if (s.hits && s.hits < s.hitsMax) damagedStructures.push(s);
            }
        }

        towers.forEach((tower) => {
            if (hostiles.length > 0) {
                tower.attack(hostiles[0]);
            } else if (damagedStructures.length > 0) {
                tower.repair(damagedStructures[0]);
            } else if (damagedWalls.length > 0) {
                tower.repair(damagedWalls[0]);
            }
        });
    },

    getDefenseStatus(room) {
        const towers = cache.getMyStructures(room, STRUCTURE_TOWER);
        const hostiles = cache.getEnemies(room);
        const ramparts = cache.getMyStructures(room, STRUCTURE_RAMPART);

        return {
            towers: towers.length,
            hostiles: hostiles.length,
            ramparts: ramparts.length,
            underAttack: hostiles.length > 0,
        };
    },
};

module.exports = DefenseManager;
