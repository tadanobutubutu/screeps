/**
 * Auto Tutorial System - チュートリアルを完全自動でクリア
 */

const logger = require('utils.logging');

const autoTutorial = {
    _towersCache: { time: 0, towers: [] },

    /**
     * ⚡ PERFORMANCE OPTIMIZATION: Get cached towers to avoid O(N) _.filter every tick
     */
    _getTowers: function () {
        if (this._towersCache.time !== Game.time) {
            this._towersCache.towers = [];
            for (let id in Game.structures) {
                if (!Object.prototype.hasOwnProperty.call(Game.structures, id)) continue;
                const s = Game.structures[id];
                if (s.structureType === STRUCTURE_TOWER) {
                    this._towersCache.towers.push(s);
                }
            }
            this._towersCache.time = Game.time;
        }
        return this._towersCache.towers;
    },

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
        const spawn = Game.spawns.Spawn1;
        if (spawn === undefined || spawn === null) {
            return;
        }

        // Harvesterがいなければ作成
        // ⚡ PERFORMANCE OPTIMIZATION: Avoid expensive array allocation from _.filter
        let hasHarvester = false;
        for (const creep of Object.values(Game.creeps)) {
            if (Game.creeps[name].memory.role === 'harvester') {
                hasHarvester = true;
                break;
            }
        }

        if (!hasHarvester && !spawn.spawning) {
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
        // ⚡ PERFORMANCE OPTIMIZATION: Pre-fetch sources outside the creep loop
        // to avoid expensive checks and branch evaluations inside the hot loop.
        for (let r in Game.rooms) {
            if (!Object.prototype.hasOwnProperty.call(Game.rooms, r)) continue;
            sourcesCache[r] = Game.rooms[r].find ? Game.rooms[r].find(FIND_SOURCES) : [];
        }

        // ⚡ PERFORMANCE OPTIMIZATION: Use for...in loop to avoid Object.values array allocation and reduce overhead
        for (let name in Game.creeps) {
            if (!Object.prototype.hasOwnProperty.call(Game.creeps, name)) continue;
            const creep = Game.creeps[name];
            const roomName = creep.room.name;

            if (creep.store.getFreeCapacity() > 0) {
                let sources = sourcesCache[roomName];
                if (sources && sources.length > 0) {
                    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
            } else {
                const spawn = Game.spawns.Spawn1;
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
        // ⚡ PERFORMANCE OPTIMIZATION: Pre-fetch sources outside the creep loop
        for (let r in Game.rooms) {
            if (!Object.prototype.hasOwnProperty.call(Game.rooms, r)) continue;
            sourcesCache[r] = Game.rooms[r].find ? Game.rooms[r].find(FIND_SOURCES) : [];
        }

        // ⚡ PERFORMANCE OPTIMIZATION: Use for...in loop to avoid Object.values array allocation and reduce overhead
        for (let name in Game.creeps) {
            if (!Object.prototype.hasOwnProperty.call(Game.creeps, name)) continue;
            const creep = Game.creeps[name];
            const roomName = creep.room.name;

            if (creep.store[RESOURCE_ENERGY] === 0) {
                let sources = sourcesCache[roomName];
                if (sources && sources.length > 0) {
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

        // ⚡ PERFORMANCE OPTIMIZATION: Pre-fetch targets outside the creep loop
        for (let r in Game.rooms) {
            if (!Object.prototype.hasOwnProperty.call(Game.rooms, r)) continue;
            sitesCache[r] = Game.rooms[r].find ? Game.rooms[r].find(FIND_CONSTRUCTION_SITES) : [];
            sourcesCache[r] = Game.rooms[r].find ? Game.rooms[r].find(FIND_SOURCES) : [];
        }

        // ⚡ PERFORMANCE OPTIMIZATION: Use for...in loop to avoid Object.values array allocation and reduce overhead
        for (let name in Game.creeps) {
            if (!Object.prototype.hasOwnProperty.call(Game.creeps, name)) continue;
            const creep = Game.creeps[name];
            const roomName = creep.room.name;

            let targets = sitesCache[roomName];
            if (targets && targets.length > 0) {
                if (creep.store[RESOURCE_ENERGY] === 0) {
                    let sources = sourcesCache[roomName];
                    if (sources && sources.length > 0) {
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
        const towers = this._getTowers();

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
        const sourcesCache = {};
        const sitesCache = {};
        const hostilesCache = {};

        // ⚡ PERFORMANCE OPTIMIZATION: Pre-fetch arrays outside loops
        for (let r in Game.rooms) {
            if (!Object.prototype.hasOwnProperty.call(Game.rooms, r)) continue;
            sourcesCache[r] = Game.rooms[r].find ? Game.rooms[r].find(FIND_SOURCES) : [];
            sitesCache[r] = Game.rooms[r].find ? Game.rooms[r].find(FIND_CONSTRUCTION_SITES) : [];
            hostilesCache[r] = Game.rooms[r].find ? Game.rooms[r].find(FIND_HOSTILE_CREEPS) : [];
        }

        this._handleCreeps(sourcesCache, sitesCache);
        this._handleTowers(hostilesCache);
        this._handleSpawns();
    },

    _handleCreeps: function (sourcesCache, sitesCache) {
        // 基本的なCreep動作
        // ⚡ PERFORMANCE OPTIMIZATION: Use for...in loop to avoid Object.values array allocation and reduce overhead
        for (let name in Game.creeps) {
            if (!Object.prototype.hasOwnProperty.call(Game.creeps, name)) continue;
            const creep = Game.creeps[name];
            const roomName = creep.room.name;

            // エネルギーが空
            if (creep.store[RESOURCE_ENERGY] === 0) {
                let sources = sourcesCache[roomName];
                if (sources && sources.length > 0) {
                    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
            } else {
                // 建設サイト優先
                let targets = sitesCache[roomName];
                if (targets && targets.length > 0) {
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
                    const spawn = Game.spawns.Spawn1;
                    if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                }
            }
        }
    },

    _handleTowers: function (hostilesCache) {
        // Tower防衛
        const towers = this._getTowers();
        for (const tower of towers) {
            const roomName = tower.room.name;
            let hostiles = hostilesCache[roomName];
            if (hostiles && hostiles.length > 0) {
                tower.attack(hostiles[0]);
            }
        }
    },

    _handleSpawns: function () {
        // 自動Spawn
        const spawn = Game.spawns.Spawn1;
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
            '  Energy: ' + (Game.spawns.Spawn1 ? Game.spawns.Spawn1.store[RESOURCE_ENERGY] : 0)
        );
    },
};

module.exports = autoTutorial;
