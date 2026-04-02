// 🛡️ Advanced Defense Manager
// 自動防衛システム - タワー制御と緊急防衛creep生成

const defenseManager = {
    // メイン防衛ループ
    run: function (room) {
        this.manageTowers(room);
        this.checkThreats(room);
        this.manageDefenders(room);
    },

    // タワー自動制御
    manageTowers: function (room) {
        // ⚡ PERFORMANCE: Reuse cached room structures and creeps if available (populated by dashboard)
        if (room._myStructuresTick !== Game.time) {
            room._myStructures = room.find(FIND_MY_STRUCTURES);
            room._myStructuresTick = Game.time;
        }

        // ⚡ PERFORMANCE: Cache towers per-tick
        if (room._towersTick !== Game.time) {
            room._towers = room._myStructures.filter((s) => s.structureType === STRUCTURE_TOWER);
            room._towersTick = Game.time;
        }
        const towers = room._towers;

        if (towers.length === 0) {
            return;
        }

        // 脅威の優先順位付け
        if (room._hostileCreepsTick !== Game.time) {
            room._hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
            room._hostileCreepsTick = Game.time;
        }
        const hostiles = room._hostileCreeps;

        if (room._myCreepsTick !== Game.time) {
            room._myCreeps = room.find(FIND_MY_CREEPS);
            room._myCreepsTick = Game.time;
        }

        // ⚡ PERFORMANCE: Per-tick caching of injured creeps (shared across roles)
        if (room._injuredCreepsTick !== Game.time) {
            room._injuredCreeps = room._myCreeps.filter((c) => c.hits < c.hitsMax);
            room._injuredCreepsTick = Game.time;
        }
        const damagedCreeps = room._injuredCreeps;

        // ⚡ PERFORMANCE: Shared per-tick caching for damaged structures
        if (room._damagedStructuresTick !== Game.time) {
            room._damagedStructures = room.find(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL,
            });
            room._damagedStructuresTick = Game.time;
        }
        const damagedStructures = room._damagedStructures;

        towers.forEach((tower) => {
            // 優先度1: 敵creepへの攻撃
            if (hostiles.length > 0) {
                const target = tower.pos.findClosestByRange(hostiles);
                if (target) {
                    tower.attack(target);
                    return;
                }
            }

            // ⚡ PERFORMANCE: Pre-calculate critical targets once per tick to reduce O(N) searches for each tower
            if (room._criticalCreepTick !== Game.time) {
                room._criticalCreep = damagedCreeps.find((c) => c.hits < c.hitsMax * 0.5);
                room._criticalCreepTick = Game.time;
            }
            const criticalCreep = room._criticalCreep;

            if (room._criticalStructureTick !== Game.time) {
                room._criticalStructure = damagedStructures.find(
                    (s) => s.hits < s.hitsMax * 0.3 && s.structureType !== STRUCTURE_RAMPART
                );
                room._criticalStructureTick = Game.time;
            }
            const criticalStructure = room._criticalStructure;

            // 優先度2: 味方creepの回復
            if (criticalCreep) {
                tower.heal(criticalCreep);
                return;
            }

            // 優先度3: 構造物の修理（エネルギーが十分な時のみ）
            if (tower.store[RESOURCE_ENERGY] > 500 && criticalStructure) {
                tower.repair(criticalStructure);
            }
        });
    },

    // 脅威レベル評価
    checkThreats: function (room) {
        // ⚡ PERFORMANCE: Reuse cached hostile creeps
        if (room._hostileCreepsTick !== Game.time) {
            room._hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
            room._hostileCreepsTick = Game.time;
        }
        const hostiles = room._hostileCreeps;

        if (hostiles.length === 0) {
            if (Memory.defenseLevel) {
                delete Memory.defenseLevel;
            }
            return 0;
        }

        // 脅威レベル計算
        let threatLevel = 0;
        hostiles.forEach((hostile) => {
            // ⚡ PERFORMANCE: Use a simple loop instead of filter().length to avoid memory allocation
            for (const part of hostile.body) {
                if (part.type === ATTACK || part.type === RANGED_ATTACK || part.type === HEAL) {
                    threatLevel++;
                }
            }
        });

        Memory.defenseLevel = threatLevel;

        // 警告表示
        if (threatLevel > 5) {
            console.log(`🚨 HIGH THREAT in ${room.name}: Level ${threatLevel}`);
        } else if (threatLevel > 0) {
            console.log(`⚠️ Threat detected in ${room.name}: Level ${threatLevel}`);
        }

        return threatLevel;
    },

    // 防衛creep管理
    manageDefenders: function (room) {
        const threatLevel = Memory.defenseLevel || 0;

        // ⚡ PERFORMANCE: Use cached room creeps to find defenders instead of global filter
        if (room._myCreepsTick !== Game.time) {
            room._myCreeps = room.find(FIND_MY_CREEPS);
            room._myCreepsTick = Game.time;
        }

        // ⚡ PERFORMANCE: Cache defenders per-tick
        if (room._defendersTick !== Game.time) {
            room._defenders = room._myCreeps.filter((c) => c.memory.role === 'defender');
            room._defendersTick = Game.time;
        }
        const defenders = room._defenders;

        // 脅威に応じて必要な防衛creep数を決定
        const requiredDefenders = Math.min(Math.ceil(threatLevel / 3), 4);

        if (defenders.length < requiredDefenders && threatLevel > 0) {
            // スポーン準備
            // ⚡ PERFORMANCE: Use cached room structures to find spawns
            if (room._myStructuresTick !== Game.time) {
                room._myStructures = room.find(FIND_MY_STRUCTURES);
                room._myStructuresTick = Game.time;
            }

            // ⚡ PERFORMANCE: Cache free spawns per-tick
            if (room._freeSpawnsTick !== Game.time) {
                room._freeSpawns = room._myStructures.filter(
                    (s) => s.structureType === STRUCTURE_SPAWN && !s.spawning
                );
                room._freeSpawnsTick = Game.time;
            }
            const spawns = room._freeSpawns;

            if (spawns.length > 0) {
                this.spawnDefender(spawns[0], threatLevel);
            }
        }

        // 既存のdefenderに指示
        defenders.forEach((defender) => this.runDefender(defender));
    },

    // Defender creepの生成
    spawnDefender: function (spawn, threatLevel) {
        const room = spawn.room;
        const energy = room.energyAvailable;

        let body = [];

        // エネルギーと脅威レベルに応じたbody構成
        if (energy >= 1300 && threatLevel > 10) {
            // 強力な脅威用
            body = [
                TOUGH,
                TOUGH,
                MOVE,
                MOVE,
                MOVE,
                MOVE,
                MOVE,
                MOVE,
                ATTACK,
                ATTACK,
                ATTACK,
                ATTACK,
                ATTACK,
                ATTACK,
                RANGED_ATTACK,
                RANGED_ATTACK,
                HEAL,
            ];
        } else if (energy >= 800) {
            // 中程度の脅威用
            body = [TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, HEAL];
        } else if (energy >= 400) {
            // 最小構成
            body = [MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK];
        } else {
            return ERR_NOT_ENOUGH_ENERGY;
        }

        const name = `Defender_${Game.time}`;
        const result = spawn.spawnCreep(body, name, {
            memory: { role: 'defender', mode: 'patrol' },
        });

        if (result === OK) {
            console.log(`🛡️ Spawning defender: ${name}`);
        }

        return result;
    },

    // Defender creepの行動制御
    runDefender: function (creep) {
        // ⚡ PERFORMANCE: Use cached hostile creeps
        if (creep.room._hostileCreepsTick !== Game.time) {
            creep.room._hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
            creep.room._hostileCreepsTick = Game.time;
        }
        const hostiles = creep.room._hostileCreeps;
        const hostile = creep.pos.findClosestByRange(hostiles);

        if (hostile) {
            // 敵を発見
            if (creep.pos.getRangeTo(hostile) > 1) {
                creep.moveTo(hostile, {
                    visualizePathStyle: { stroke: '#ff0000' },
                });
            }

            // 攻撃
            if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
                creep.rangedAttack(hostile);
            }

            // 自己回復
            if (creep.hits < creep.hitsMax * 0.6) {
                creep.heal(creep);
            }
        } else {
            // パトロールモード
            if (!creep.memory.patrolTarget) {
                const flag = Game.flags['Patrol'];
                if (flag) {
                    creep.memory.patrolTarget = flag.pos;
                } else {
                    // 部屋の中央をパトロール
                    creep.memory.patrolTarget = new RoomPosition(25, 25, creep.room.name);
                }
            }

            if (creep.pos.getRangeTo(creep.memory.patrolTarget) > 3) {
                creep.moveTo(creep.memory.patrolTarget, {
                    visualizePathStyle: { stroke: '#00ff00' },
                });
            }
        }
    },

    // 統計情報表示
    showStats: function (room) {
        // ⚡ PERFORMANCE: Use cached room objects
        if (room._myStructuresTick !== Game.time) {
            room._myStructures = room.find(FIND_MY_STRUCTURES);
            room._myStructuresTick = Game.time;
        }

        if (room._towersTick !== Game.time) {
            room._towers = room._myStructures.filter((s) => s.structureType === STRUCTURE_TOWER);
            room._towersTick = Game.time;
        }
        const towers = room._towers.length;

        if (room._myCreepsTick !== Game.time) {
            room._myCreeps = room.find(FIND_MY_CREEPS);
            room._myCreepsTick = Game.time;
        }

        if (room._defendersTick !== Game.time) {
            room._defenders = room._myCreeps.filter((c) => c.memory.role === 'defender');
            room._defendersTick = Game.time;
        }
        const defenders = room._defenders.length;

        const threatLevel = Memory.defenseLevel || 0;

        console.log(`🛡️ Defense Status [${room.name}]:`);
        console.log(`   Towers: ${towers} | Defenders: ${defenders} | Threat: ${threatLevel}`);
    },
};

module.exports = defenseManager;
