/**
 * Auto Tutorial System - チュートリアルを完全自動でクリア
 */

const logger = require('utils.logging');

const autoTutorial = {
    /**
     * チュートリアル検出
     */
    isTutorial: function () {
        // Tutorialモード検出
        return Game.tutorial && Game.tutorial.currentStep !== undefined;
    },

    /**
     * メイン自動実行
     */
    run: function () {
        if (!this.isTutorial()) {
            return false;
        }

        const step = Game.tutorial.currentStep;
        // Security: Use centralized logger to prevent console injection and ensure HTML escaping
        logger.info('🎮 Auto Tutorial - Step: ' + step);

        // ステップ別処理
        switch (step) {
            case 1:
                this.step1_createHarvester();
                break;
            case 2:
                this.step2_harvestEnergy();
                break;
            case 3:
                this.step3_upgradeController();
                break;
            case 4:
                this.step4_buildExtension();
                break;
            case 5:
                this.step5_defendRoom();
                break;
            default:
                this.autoStep();
        }

        return true;
    },

    /**
     * Step 1: Create harvester
     */
    step1_createHarvester: function () {
        const spawn = Game.spawns['Spawn1'];
        if (spawn === undefined || spawn === null) {
            return;
        }

        // Harvesterがいなければ作成
        const harvesters = _.filter(Game.creeps, (c) => c.memory.role === 'harvester');

        if (harvesters.length === 0 && !spawn.spawning) {
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester1', {
                memory: { role: 'harvester' },
            });
            logger.info('✅ Created Harvester');
        }
    },

    /**
     * Step 2: Harvest energy
     */
    step2_harvestEnergy: function () {
        const sourcesCache = {};
        for (const roomName in Game.rooms) {
            sourcesCache[roomName] =
                Game.rooms[roomName] && Game.rooms[roomName].find
                    ? Game.rooms[roomName].find(FIND_SOURCES)
                    : [];
        }
        for (const creep of Object.values(Game.creeps)) {
            const roomName = creep.room.name;

            if (creep.store.getFreeCapacity() > 0) {
                const sources = sourcesCache[roomName] || [];
                if (sources.length > 0) {
                    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
            } else {
                const spawn = Game.spawns['Spawn1'];
                if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            }
        }
    },

    /**
     * Step 3: Upgrade controller
     */
    step3_upgradeController: function () {
        const sourcesCache = {};
        for (const roomName in Game.rooms) {
            sourcesCache[roomName] =
                Game.rooms[roomName] && Game.rooms[roomName].find
                    ? Game.rooms[roomName].find(FIND_SOURCES)
                    : [];
        }
        for (const creep of Object.values(Game.creeps)) {
            const roomName = creep.room.name;

            if (creep.store[RESOURCE_ENERGY] === 0) {
                const sources = sourcesCache[roomName] || [];
                if (sources.length > 0) {
                    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
            } else {
                if (creep.room.controller) {
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    },

    /**
     * Step 4: Build extension
     */
    step4_buildExtension: function () {
        const sitesCache = {};
        const sourcesCache = {};
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            sitesCache[roomName] = room && room.find ? room.find(FIND_CONSTRUCTION_SITES) : [];
            sourcesCache[roomName] = room && room.find ? room.find(FIND_SOURCES) : [];
        }

        for (const creep of Object.values(Game.creeps)) {
            const roomName = creep.room.name;

            const targets = sitesCache[roomName] || [];

            if (targets.length > 0) {
                if (creep.store[RESOURCE_ENERGY] === 0) {
                    const sources = sourcesCache[roomName] || [];

                    if (sources.length > 0) {
                        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0]);
                        }
                    }
                } else {
                    if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }
        }
    },

    /**
     * Step 5: Defend room
     */
    step5_defendRoom: function () {
        const towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);

        if (towers.length > 0) {
            const tower = towers[0];
            const hostiles = tower.room.find(FIND_HOSTILE_CREEPS);

            if (hostiles.length > 0) {
                tower.attack(hostiles[0]);
                logger.info('💥 Attacking hostile!');
            }
        }
    },

    /**
     * 汎用自動ステップ
     */
    autoStep: function () {
        const caches = this._prepopulateCaches();
        this._autoStepCreeps(caches);
        this._autoStepTowers(caches);
        this._autoStepSpawn();
    },

    _prepopulateCaches: function () {
        const caches = { sourcesCache: {}, sitesCache: {}, hostilesCache: {} };
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            caches.sourcesCache[roomName] = room && room.find ? room.find(FIND_SOURCES) : [];
            caches.sitesCache[roomName] =
                room && room.find ? room.find(FIND_CONSTRUCTION_SITES) : [];
            caches.hostilesCache[roomName] =
                room && room.find ? room.find(FIND_HOSTILE_CREEPS) : [];
        }
        return caches;
    },

    _autoStepCreeps: function (caches) {
        const { sourcesCache, sitesCache } = caches;
        // 基本的なCreep動作
        for (const creep of Object.values(Game.creeps)) {
            const roomName = creep.room.name;

            // エネルギーが空
            if (creep.store[RESOURCE_ENERGY] === 0) {
                const sources = sourcesCache[roomName] || [];
                if (sources.length > 0) {
                    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
            } else {
                // 建設サイト優先
                const targets = sitesCache[roomName] || [];
                if (targets.length > 0) {
                    if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                } else if (creep.room.controller) {
                    // 次にControllerアップグレード
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                } else {
                    // Spawnに配達
                    const spawn = Game.spawns['Spawn1'];
                    if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                }
            }
        }
    },

    _autoStepTowers: function (caches) {
        const { hostilesCache } = caches;
        // Tower防衛
        const towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);
        for (const tower of towers) {
            const roomName = tower.room.name;
            const hostiles = hostilesCache[roomName] || [];
            if (hostiles.length > 0) {
                tower.attack(hostiles[0]);
            }
        }
    },

    _autoStepSpawn: function () {
        // 自動Spawn
        const spawn = Game.spawns['Spawn1'];
        if (spawn && !spawn.spawning && Object.keys(Game.creeps).length < 3) {
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker' + Game.time, {
                memory: { role: 'worker' },
            });
        }
    },

    /**
     * チュートリアルスキップ（可能な場合）
     */
    skipIfPossible: function () {
        if (Game.tutorial && Game.tutorial.skip) {
            Game.tutorial.skip();
            logger.info('⏩ Tutorial skipped!');
            return true;
        }
        return false;
    },

    /**
     * チュートリアル進捗表示
     */
    showProgress: function () {
        if (!this.isTutorial()) {
            return;
        }

        // Security: Use centralized logger to prevent console injection
        logger.info('🎮 Tutorial Progress:');
        logger.info('  Current Step: ' + Game.tutorial.currentStep);
        logger.info('  Creeps: ' + Object.keys(Game.creeps).length);
        logger.info(
            '  Energy: ' +
                (Game.spawns['Spawn1'] ? Game.spawns['Spawn1'].store[RESOURCE_ENERGY] : 0)
        );
    },
};

module.exports = autoTutorial;
